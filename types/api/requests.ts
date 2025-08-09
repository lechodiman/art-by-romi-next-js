import { CartItem } from '../core/cart';
import { CustomerInfo } from '../core/customer';

export interface CheckoutRequest {
  items: CartItem[];
  customer: CustomerInfo;
  paymentMethod?: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  customer: CustomerInfo;
  items: CartItem[];
}

export interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  recaptchaToken: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  customizations?: {
    extraPets?: number;
    hasSpecialBackground?: boolean;
    hasFrame?: boolean;
    petNames?: string[];
    backgroundDescription?: string;
  };
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity?: number;
  customizations?: {
    extraPets?: number;
    hasSpecialBackground?: boolean;
    hasFrame?: boolean;
    petNames?: string[];
    backgroundDescription?: string;
  };
}