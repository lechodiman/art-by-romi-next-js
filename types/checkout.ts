import { Product } from './Product';

export interface CartCustomizations {
  extraPets?: number;
  hasSpecialBackground?: boolean;
  hasFrame?: boolean;
  petNames?: string[];
  backgroundDescription?: string;
}

export interface ValidatedCartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  customizations?: CartCustomizations;
  valid: boolean;
  error?: string;
  calculatedPrice?: number;
  product?: Product;
}

export interface ValidateCartResponse {
  valid: boolean;
  items: ValidatedCartItem[];
  total: number;
  pricingConfigId: string;
}

export interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    rut: string;
    phone: string;
    address: string;
    additionalInfo?: string;
    region: string;
    comuna: string;
  };
  items: Array<{
    productId: string;
    productName?: string;
    quantity: number;
    price?: number;
    customizations?: CartCustomizations;
  }>;
  total: number;
  createdAt: string;
}

export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  rut: string;
  phone: string;
  address: string;
  additionalInfo?: string;
  region: string;
  comuna: string;
};