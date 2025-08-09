import { Order, Payment } from '../core/order';
import { CartItemWithProduct } from '../core/cart';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface CheckoutResponse {
  order: Order;
  paymentUrl?: string;
  preferenceId?: string;
}

export interface PaymentResponse {
  payment: Payment;
  redirectUrl?: string;
}

export interface CartResponse {
  items: CartItemWithProduct[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export interface OrderResponse extends Order {
  formattedTotal: string;
  formattedDate: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}