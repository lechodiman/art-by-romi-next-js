import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { OrderService } from '@/lib/services/order-service';
import { CreateOrderInput, CreateOrderItemInput } from '@/types/database';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { activePricingConfigQuery } from '@/sanity/lib/queries';
import { PricingConfig } from '@/types/PricingConfig';
import { PriceCalculator } from '@/lib/pricing/service';
import { Product } from '@/types/Product';

// Request validation schema
const createOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    rut: z.string().min(1),
    phone: z.string().min(1),
    email: z.email(),
    address: z.string().min(1),
    additionalInfo: z.string().optional(),
    region: z.string().min(1),
    comuna: z.string().min(1),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      customizations: z
        .object({
          petCount: z.number().int().positive().default(1),
          extraPets: z.number().int().min(0).default(0),
          hasSpecialBackground: z.boolean().default(false),
          hasFrame: z.boolean().default(false),
          frameSize: z.string().optional(),
          petNames: z.array(z.string()).optional(),
          backgroundDescription: z.string().optional(),
        })
        .optional(),
    })
  ),
  paymentIntentId: z.string().optional(), // Optional, for linking to payment
  metadata: z.record(z.string(), z.any()).optional(),
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validationResult = createOrderSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validationResult.error.issues,
      });
    }

    const { customer, items, paymentIntentId, metadata } = validationResult.data;

    // Fetch pricing config and products
    const productIds = items.map((item) => item.productId);
    const [pricingConfig, products] = await Promise.all([
      client.fetch<PricingConfig>(activePricingConfigQuery),
      client.fetch<Product[]>(
        groq`*[_type == "product" && _id in $productIds] {
          _id,
          name,
          slug,
          price,
          size
        }`,
        { productIds }
      )
    ]);

    if (!pricingConfig) {
      return res.status(500).json({ error: 'Pricing configuration not found' });
    }

    if (!products || products.length !== items.length) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }

    // Create price calculator
    const calculator = new PriceCalculator(pricingConfig);

    // Calculate totals and prepare order items
    let subtotal = 0;
    const orderItems: CreateOrderItemInput[] = [];

    for (const item of items) {
      const product = products.find((p) => p._id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      // Calculate price using centralized calculator
      const priceResult = calculator.calculateItemPrice(product, item.customizations);
      const unitPrice = priceResult.totalPrice;

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        order_id: '', // Will be set after order creation
        product_id: product._id,
        product_name: product.name,
        product_slug: undefined, // Product type doesn't have slug
        unit_price: unitPrice,
        quantity: item.quantity,
        total_price: totalPrice,
        pet_count: item.customizations?.petCount || 1,
        has_special_background: item.customizations?.hasSpecialBackground || false,
        has_frame: item.customizations?.hasFrame || false,
        frame_size: item.customizations?.frameSize,
        pet_names: item.customizations?.petNames,
        background_description: item.customizations?.backgroundDescription,
        customizations: {
          ...item.customizations,
          extraPets: item.customizations?.extraPets || 0,
        },
      });
    }

    // Create order data
    const orderData: CreateOrderInput = {
      customer_email: customer.email,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_rut: customer.rut,
      customer_phone: customer.phone,
      shipping_address: customer.address,
      shipping_additional_info: customer.additionalInfo,
      shipping_region: customer.region,
      shipping_comuna: customer.comuna,
      subtotal,
      shipping_cost: 0, // TODO: Calculate shipping based on region
      total: subtotal, // TODO: Add shipping cost
      metadata: {
        ...metadata,
        paymentIntentId,
      },
    };

    // Create order with items
    const order = await OrderService.createOrder(orderData, orderItems);

    // If payment intent ID is provided, update order status
    if (paymentIntentId) {
      // This would typically be called after payment confirmation
      // For now, we'll keep it as pending
    }

    // Return order details
    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        total: order.total,
        createdAt: order.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);

    res.status(500).json({
      error: 'Failed to create order',
      message: error.message,
    });
  }
}
