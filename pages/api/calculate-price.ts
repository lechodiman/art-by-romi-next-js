import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '@/sanity/lib/client'
import { productByIdQuery, activePricingConfigQuery } from '@/sanity/lib/queries'
import { Product } from '@/types/Product'
import { PricingConfig } from '@/types/PricingConfig'

interface CalculatePriceRequest {
  productId: string
  customizations?: {
    extraPets?: number
    hasSpecialBackground?: boolean
    hasFrame?: boolean
  }
}

interface CalculatePriceResponse {
  basePrice: number
  customizations: CalculatePriceRequest['customizations']
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

    // Calculate price breakdown
    const breakdown = {
      basePrice: product.price,
      extraPetsPrice: 0,
      backgroundPrice: 0,
      framePrice: 0
    }

    let totalPrice = product.price

    // Add extra pets cost
    if (customizations?.extraPets) {
      if (customizations.extraPets === 1) {
        breakdown.extraPetsPrice = pricingConfig.extraPets.onePet
        totalPrice += pricingConfig.extraPets.onePet
      } else if (customizations.extraPets === 2) {
        breakdown.extraPetsPrice = pricingConfig.extraPets.twoPets
        totalPrice += pricingConfig.extraPets.twoPets
      }
    }

    // Add special background cost
    if (customizations?.hasSpecialBackground) {
      breakdown.backgroundPrice = pricingConfig.specialBackground
      totalPrice += pricingConfig.specialBackground
    }

    // Add frame cost based on product size
    if (customizations?.hasFrame && product.size) {
      const framePrice = pricingConfig.framePrices[product.size as keyof typeof pricingConfig.framePrices]
      if (framePrice) {
        breakdown.framePrice = framePrice
        totalPrice += framePrice
      }
    }

    res.status(200).json({
      basePrice: product.price,
      customizations: customizations,
      totalPrice: totalPrice,
      pricingConfigId: pricingConfig._id,
      breakdown: breakdown
    })
  } catch (error) {
    console.error('Price calculation error:', error)
    res.status(500).json({ error: 'Failed to calculate price' })
  }
}