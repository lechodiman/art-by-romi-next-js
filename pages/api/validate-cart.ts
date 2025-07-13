import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '@/sanity/lib/client'
import { productsByIdsQuery, activePricingConfigQuery } from '@/sanity/lib/queries'
import { Product } from '@/types/Product'
import { PricingConfig } from '@/types/PricingConfig'

interface CartItem {
  cartItemId: string
  productId: string
  quantity: number
  customizations?: {
    extraPets?: number
    hasSpecialBackground?: boolean
    hasFrame?: boolean
    petNames?: string[]
    backgroundDescription?: string
  }
}

interface ValidatedCartItem extends CartItem {
  valid: boolean
  error?: string
  calculatedPrice?: number
  product?: Product
}

interface ValidateCartRequest {
  items: CartItem[]
}

interface ValidateCartResponse {
  valid: boolean
  items: ValidatedCartItem[]
  total: number
  pricingConfigId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidateCartResponse | { error: string }>
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

    // Validate each item and calculate prices
    const validatedItems: ValidatedCartItem[] = items.map(item => {
      const product = products.find(p => p._id === item.productId)
      
      if (!product) {
        return { 
          ...item, 
          valid: false, 
          error: 'Product not found' 
        }
      }

      // Calculate price server-side
      let price = product.price
      
      // Add extra pets cost
      if (item.customizations?.extraPets) {
        if (item.customizations.extraPets === 1) {
          price += pricingConfig.extraPets.onePet
        } else if (item.customizations.extraPets === 2) {
          price += pricingConfig.extraPets.twoPets
        } else if (item.customizations.extraPets > 2) {
          return { 
            ...item, 
            valid: false, 
            error: 'Maximum 2 extra pets allowed' 
          }
        }
      }

      // Add special background cost
      if (item.customizations?.hasSpecialBackground) {
        price += pricingConfig.specialBackground
      }

      // Add frame cost based on product size
      if (item.customizations?.hasFrame && product.size) {
        const framePrice = pricingConfig.framePrices[product.size as keyof typeof pricingConfig.framePrices]
        if (framePrice) {
          price += framePrice
        }
      }

      // Validate quantity
      if (item.quantity < 1 || item.quantity > 99) {
        return { 
          ...item, 
          valid: false, 
          error: 'Invalid quantity' 
        }
      }

      return {
        ...item,
        valid: true,
        calculatedPrice: price,
        product: product
      }
    })

    const isValid = validatedItems.every(item => item.valid)
    const total = validatedItems.reduce((sum, item) => 
      sum + ((item.calculatedPrice || 0) * item.quantity), 0
    )

    res.status(200).json({
      valid: isValid,
      items: validatedItems,
      total: total,
      pricingConfigId: pricingConfig._id
    })
  } catch (error) {
    console.error('Cart validation error:', error)
    res.status(500).json({ error: 'Failed to validate cart' })
  }
}