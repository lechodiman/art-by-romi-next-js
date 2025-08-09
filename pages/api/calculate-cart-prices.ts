import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/sanity/lib/client';
import { productsByIdsQuery, activePricingConfigQuery } from '@/sanity/lib/queries';
import { Product } from '@/types/Product';
import { PricingConfig } from '@/types/PricingConfig';
import { PriceCalculator } from '@/lib/pricing/service';
import { CartItem, ValidatedCartItem } from '@/lib/pricing/types';

interface CalculatePricesRequest {
  items: CartItem[];
}

interface CalculatePricesResponse {
  items: ValidatedCartItem[];
  total: number;
  valid: boolean;
  pricingConfigId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculatePricesResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body as CalculatePricesRequest;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(200).json({ 
        items: [], 
        total: 0,
        valid: true,
        pricingConfigId: ''
      });
    }

    // Extract unique product IDs
    const productIds = [...new Set(items.map((item) => item.productId))];

    // Fetch products and pricing config
    const [products, pricingConfig] = await Promise.all([
      client.fetch<Product[]>(productsByIdsQuery, { ids: productIds }),
      client.fetch<PricingConfig>(activePricingConfigQuery),
    ]);

    if (!pricingConfig) {
      return res.status(500).json({ error: 'Pricing configuration not found' });
    }

    // Use centralized PriceCalculator with validateCart method
    const calculator = new PriceCalculator(pricingConfig);
    const validationResult = calculator.validateCart(items, products);

    res.status(200).json({
      items: validationResult.items,
      total: validationResult.total,
      valid: validationResult.valid,
      pricingConfigId: validationResult.pricingConfigId,
    });
  } catch (error) {
    console.error('Cart price calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate cart prices' });
  }
}
