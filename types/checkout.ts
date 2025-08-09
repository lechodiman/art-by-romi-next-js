import type { AllProductsQueryResult } from '../sanity.types';

type Product = AllProductsQueryResult[number];

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


export interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    rut: string;
    phone: string;
    address: string;
    additionalInfo?: string;
    region: string;
    comuna: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    customizations?: CartCustomizations;
  }>;
  createdAt: string;
}

export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  phone: string;
  address: string;
  additionalInfo?: string;
  region: string;
  comuna: string;
};