import { CartItem as BaseCartItem, CartItemCustomizations } from '@/types';
import type { AllProductsQueryResult } from '@/sanity.types';

type Product = AllProductsQueryResult[number];

// Re-export from centralized types for backward compatibility
export type CartItem = BaseCartItem;
export type ItemCustomizations = CartItemCustomizations;

export interface PriceCalculationResult {
  basePrice: number;
  totalPrice: number;
  breakdown: PriceBreakdown;
}

export interface PriceBreakdown {
  basePrice: number;
  extraPetsPrice: number;
  backgroundPrice: number;
  framePrice: number;
}

export interface ValidatedCartItem extends CartItem {
  valid: boolean;
  error?: string;
  calculatedPrice?: number;
  product?: Product;
}

export interface CartValidationResult {
  valid: boolean;
  items: ValidatedCartItem[];
  total: number;
  pricingConfigId: string;
}
