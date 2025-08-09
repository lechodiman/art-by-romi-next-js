import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '@/sanity/lib/client'
import { productByIdQuery, activePricingConfigQuery } from '@/sanity/lib/queries'
import { Product } from '@/types/Product'
import { PricingConfig } from '@/types/PricingConfig'
import { PriceCalculator } from '@/lib/pricing/service'
import { ItemCustomizations } from '@/lib/pricing/types'

interface CalculatePriceRequest {
  productId: string
  customizations?: ItemCustomizations
}

interface CalculatePriceResponse {
  basePrice: number
  customizations: ItemCustomizations
  totalPrice: number
  pricingConfigId: string
  breakdown?: {
    basePrice: number
    extraPetsPrice: number
    backgroundPrice: number
    framePrice: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculatePriceResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { productId, customizations } = req.body as CalculatePriceRequest

    // Validate input
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    // Fetch product and pricing config from Sanity
    const [product, pricingConfig] = await Promise.all([
      client.fetch<Product>(productByIdQuery, { id: productId }),
      client.fetch<PricingConfig>(activePricingConfigQuery)
    ])

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (!pricingConfig) {
      return res.status(500).json({ error: 'Pricing configuration not found' })
    }

    // Use centralized PriceCalculator
    const calculator = new PriceCalculator(pricingConfig)
    
    try {
      const priceResult = calculator.calculateItemPrice(product, customizations)
      
      res.status(200).json({
        basePrice: priceResult.basePrice,
        customizations: customizations || {},
        totalPrice: priceResult.totalPrice,
        pricingConfigId: calculator.getPricingConfigId(),
        breakdown: priceResult.breakdown
      })
    } catch (error) {
      console.error('Price calculation error:', error)
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to calculate price' 
      })
    }
  } catch (error) {
    console.error('Price calculation error:', error)
    res.status(500).json({ error: 'Failed to calculate price' })
  }
}