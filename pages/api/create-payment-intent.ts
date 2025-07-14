import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getPaymentProvider, getProviderConfig } from '@/lib/payment-providers';
import { OrderService } from '@/lib/services/order-service';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import crypto from 'crypto';

// Request validation schema
const createPaymentIntentSchema = z.object({
  provider: z.enum(['mercadopago']).default('mercadopago'),
  orderId: z.uuid(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      customizations: z
        .object({
          petCount: z.number().int().positive().optional(),
          hasSpecialBackground: z.boolean().optional(),
          hasFrame: z.boolean().optional(),
          frameSize: z.string().optional(),
          petNames: z.array(z.string()).optional(),
          backgroundDescription: z.string().optional(),
        })
        .optional(),
    })
  ),
  customer: z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    rut: z.string(),
    phone: z.string(),
  }),
  returnUrl: z.url().optional(),
  cancelUrl: z.url().optional(),
});

// Helper to calculate item price based on customizations
function calculateItemPrice(
  basePrice: number,
  customizations?: any,
  extraPetPrice?: number
): number {
  let price = basePrice;

  // Add extra pet charges
  if (customizations?.petCount && customizations.petCount > 1 && extraPetPrice) {
    price += (customizations.petCount - 1) * extraPetPrice;
  }

  // Add background charge (50% of base price)
  if (customizations?.hasSpecialBackground) {
    price *= 1.5;
  }

  // Frame prices are handled separately based on size

  return Math.round(price); // Round to avoid decimal issues
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validationResult = createPaymentIntentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validationResult.error.issues,
      });
    }

    const { provider, orderId, items, customer, returnUrl, cancelUrl } =
      validationResult.data;

    // Generate idempotency key based on order ID
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${orderId}-${provider}`)
      .digest('hex');

    // Check if payment intent already exists
    const existingIntent = await OrderService.checkIdempotencyKey(idempotencyKey);
    if (existingIntent) {
      return res.status(200).json({
        id: existingIntent.provider_payment_id,
        status: existingIntent.status,
        amount: existingIntent.amount,
        currency: existingIntent.currency,
        redirectUrl: existingIntent.provider_data?.redirectUrl,
      });
    }

    // Fetch product details from Sanity
    const productIds = items.map((item) => item.productId);
    const products = await client.fetch(
      groq`*[_type == "product" && _id in $productIds] {
        _id,
        name,
        slug,
        price,
        extraPetPrice
      }`,
      { productIds }
    );

    if (!products || products.length !== items.length) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }

    // Calculate total amount and prepare items for payment provider
    let totalAmount = 0;
    const paymentItems = items.map((item) => {
      const product = products.find((p: any) => p._id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const unitPrice = calculateItemPrice(
        product.price,
        item.customizations,
        product.extraPetPrice
      );

      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      return {
        id: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: unitPrice,
        description: `${product.name}${
          item.customizations?.petCount && item.customizations.petCount > 1
            ? ` (${item.customizations.petCount} mascotas)`
            : ''
        }${item.customizations?.hasSpecialBackground ? ' con fondo especial' : ''}`,
      };
    });

    // Get payment provider
    const providerConfig = getProviderConfig(provider);
    const paymentProvider = getPaymentProvider(provider, providerConfig);

    // Create payment intent with provider
    const paymentIntent = await paymentProvider.createPaymentIntent({
      orderId,
      amount: totalAmount,
      currency: 'CLP',
      customer,
      items: paymentItems,
      metadata: {
        orderId,
        itemCount: items.length,
      },
      returnUrl,
      cancelUrl,
    });

    // Save payment intent to database
    await OrderService.createPaymentIntent({
      order_id: orderId,
      provider,
      provider_payment_id: paymentIntent.id,
      amount: totalAmount,
      currency: 'CLP',
      provider_data: {
        redirectUrl: paymentIntent.redirectUrl,
        additionalData: paymentIntent.additionalData,
      },
      idempotency_key: idempotencyKey,
    });

    // Return payment intent details to client
    res.status(200).json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.clientSecret,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      redirectUrl: paymentIntent.redirectUrl,
      additionalData: paymentIntent.additionalData,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);

    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error.message,
    });
  }
}
