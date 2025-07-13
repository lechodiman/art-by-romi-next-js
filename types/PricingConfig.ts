export interface PricingConfig {
  _id: string
  name: string
  extraPets: {
    onePet: number
    twoPets: number
  }
  specialBackground: number
  framePrices: {
    mini: number
    medium: number
    large: number
  }
  isActive: boolean
  validFrom: string
}