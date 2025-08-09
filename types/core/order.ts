import { CartItem } from './cart';
import { CustomerInfo } from './customer';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export type PaymentMethod = 
  | 'mercadopago'
  | 'bank_transfer'
  | 'cash';

export interface BaseOrder {
  id: string;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  totalAmount: number;
}

export interface OrderItem extends CartItem {
  orderId: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Order extends BaseOrder {
  customer: CustomerInfo;
  items: OrderItem[];
  payment?: Payment;
  shipping?: ShippingInfo;
  notes?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  paymentDate?: Date;
  metadata?: Record<string, any>;
}

export interface ShippingInfo {
  method: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  cost: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}