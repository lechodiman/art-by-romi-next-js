import { Product } from '@/types/Product';

export interface ItemCustomizations {
  extraPets?: number;
  hasSpecialBackground?: boolean;
  hasFrame?: boolean;
  petNames?: string[];
  backgroundDescription?: string;
}

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

export interface CartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  customizations?: ItemCustomizations;
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
