import { Product } from '@/types/Product'
import { PricingConfig } from '@/types/PricingConfig'
import {
  ItemCustomizations,
  PriceCalculationResult,
  PriceBreakdown,
  CartItem,
  ValidatedCartItem,
  CartValidationResult
} from './types'

export class PriceCalculator {
  constructor(private pricingConfig: PricingConfig) {
    if (!pricingConfig) {
      throw new Error('Pricing configuration is required')
    }
  }

  /**
   * Calculate the price for a single item with customizations
   * This is the single source of truth for pricing logic
   */
  calculateItemPrice(
    product: Product,
    customizations?: ItemCustomizations
  ): PriceCalculationResult {
    const breakdown: PriceBreakdown = {
      basePrice: product.price,
      extraPetsPrice: 0,
      backgroundPrice: 0,
      framePrice: 0
    }

    let totalPrice = product.price

    // Calculate extra pets cost
    if (customizations?.extraPets) {
      if (customizations.extraPets === 1) {
        breakdown.extraPetsPrice = this.pricingConfig.extraPets.onePet
        totalPrice += this.pricingConfig.extraPets.onePet
      } else if (customizations.extraPets === 2) {
        breakdown.extraPetsPrice = this.pricingConfig.extraPets.twoPets
        totalPrice += this.pricingConfig.extraPets.twoPets
      } else if (customizations.extraPets > 2) {
        throw new Error('Maximum 2 extra pets allowed')
      }
    }

    // Calculate special background cost
    if (customizations?.hasSpecialBackground) {
      breakdown.backgroundPrice = this.pricingConfig.specialBackground
      totalPrice += this.pricingConfig.specialBackground
    }

    // Calculate frame cost based on product size
    if (customizations?.hasFrame && product.size) {
      const framePrice = this.pricingConfig.framePrices[
        product.size as keyof PricingConfig['framePrices']
      ]
      if (framePrice) {
        breakdown.framePrice = framePrice
        totalPrice += framePrice
      }
    }

    return {
      basePrice: product.price,
      totalPrice,
      breakdown
    }
  }

  /**
   * Validate a cart item and calculate its price
   */
  validateCartItem(
    item: CartItem,
    product: Product | undefined
  ): ValidatedCartItem {
    // Check if product exists
    if (!product) {
      return {
        ...item,
        valid: false,
        error: 'Product not found'
      }
    }

    // Validate quantity
    if (item.quantity < 1 || item.quantity > 99) {
      return {
        ...item,
        valid: false,
        error: 'Invalid quantity (must be between 1 and 99)'
      }
    }

    // Validate extra pets
    if (item.customizations?.extraPets && item.customizations.extraPets > 2) {
      return {
        ...item,
        valid: false,
        error: 'Maximum 2 extra pets allowed'
      }
    }

    try {
      // Calculate price
      const priceResult = this.calculateItemPrice(product, item.customizations)
      
      return {
        ...item,
        valid: true,
        calculatedPrice: priceResult.totalPrice,
        product
      }
    } catch (error) {
      return {
        ...item,
        valid: false,
        error: error instanceof Error ? error.message : 'Price calculation failed'
      }
    }
  }

  /**
   * Validate entire cart and calculate total
   */
  validateCart(
    items: CartItem[],
    products: Product[]
  ): CartValidationResult {
    const validatedItems: ValidatedCartItem[] = items.map(item => {
      const product = products.find(p => p._id === item.productId)
      return this.validateCartItem(item, product)
    })

    const isValid = validatedItems.every(item => item.valid)
    const total = validatedItems.reduce((sum, item) => {
      if (item.valid && item.calculatedPrice) {
        return sum + (item.calculatedPrice * item.quantity)
      }
      return sum
    }, 0)

    return {
      valid: isValid,
      items: validatedItems,
      total,
      pricingConfigId: this.pricingConfig._id
    }
  }

  /**
   * Calculate cart total from validated items
   */
  calculateCartTotal(validatedItems: ValidatedCartItem[]): number {
    return validatedItems.reduce((sum, item) => {
      if (item.valid && item.calculatedPrice) {
        return sum + (item.calculatedPrice * item.quantity)
      }
      return sum
    }, 0)
  }

  /**
   * Verify that a client-provided price matches the calculated price
   * Returns true if prices match within a small tolerance (for floating point)
   */
  verifyPrice(calculatedPrice: number, providedPrice: number): boolean {
    const tolerance = 0.01 // Allow 1 cent difference for floating point issues
    return Math.abs(calculatedPrice - providedPrice) <= tolerance
  }

  /**
   * Get the pricing configuration ID for audit trail
   */
  getPricingConfigId(): string {
    return this.pricingConfig._id
  }
}