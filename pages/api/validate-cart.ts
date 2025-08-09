import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '@/sanity/lib/client'
import { productsByIdsQuery, activePricingConfigQuery } from '@/sanity/lib/queries'
import { Product } from '@/types/Product'
import { PricingConfig } from '@/types/PricingConfig'
import { PriceCalculator } from '@/lib/pricing/service'
import { CartItem, CartValidationResult } from '@/lib/pricing/types'

interface ValidateCartRequest {
  items: CartItem[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CartValidationResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { items } = req.body as ValidateCartRequest

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' })
    }

    // Extract unique product IDs
    const productIds = [...new Set(items.map(item => item.productId))]

    // Fetch products and pricing config
    const [products, pricingConfig] = await Promise.all([
      client.fetch<Product[]>(productsByIdsQuery, { ids: productIds }),
      client.fetch<PricingConfig>(activePricingConfigQuery)
    ])

    if (!pricingConfig) {
      return res.status(500).json({ error: 'Pricing configuration not found' })
    }

    // Use centralized PriceCalculator
    const calculator = new PriceCalculator(pricingConfig)
    const validationResult = calculator.validateCart(items, products)

    res.status(200).json(validationResult)
  } catch (error) {
    console.error('Cart validation error:', error)
    res.status(500).json({ error: 'Failed to validate cart' })
  }
}