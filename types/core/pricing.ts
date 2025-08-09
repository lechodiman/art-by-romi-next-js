import type { PricingConfig as SanityPricingConfig } from '../../sanity.types';

export type PricingConfig = SanityPricingConfig;

export interface PriceCalculationParams {
  basePrice: number;
  size: 'mini' | 'medium' | 'large';
  extraPets: number;
  hasSpecialBackground: boolean;
  hasFrame: boolean;
  pricingConfig: PricingConfig;
}

export interface PriceBreakdown {
  base: number;
  extraPets: number;
  specialBackground: number;
  frame: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface PricingResult {
  finalPrice: number;
  breakdown: PriceBreakdown;
}