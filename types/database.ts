// Database schema types for Supabase tables

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  status: OrderStatus;

  // Customer information
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_rut: string;
  customer_phone: string;

  // Shipping information
  shipping_address: string;
  shipping_additional_info?: string;
  shipping_region: string;
  shipping_comuna: string;

  // Order totals
  subtotal: number;
  shipping_cost: number;
  total: number;

  // Metadata
  metadata?: Record<string, any>;
  notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string; // Sanity product ID
  product_name: string;
  product_slug?: string;

  // Pricing
  unit_price: number;
  quantity: number;
  total_price: number;

  // Customizations
  pet_count: number;
  has_special_background: boolean;
  has_frame: boolean;
  frame_size?: string;
  pet_names?: string[];
  background_description?: string;
  customizations?: Record<string, any>;

  // Timestamps
  created_at: string;
}

export interface PaymentIntent {
  id: string;
  order_id: string;
  provider: 'mercadopago'; // Add more as needed
  provider_payment_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;

  // Provider-specific data
  provider_data?: Record<string, any>;

  // Error handling
  error_code?: string;
  error_message?: string;

  // Idempotency
  idempotency_key?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Input types for creating records
export interface CreateOrderInput {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_rut: string;
  customer_phone: string;
  shipping_address: string;
  shipping_additional_info?: string;
  shipping_region: string;
  shipping_comuna: string;
  subtotal: number;
  shipping_cost?: number;
  total: number;
  metadata?: Record<string, any>;
  notes?: string;
}

export interface CreateOrderItemInput {
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  pet_count?: number;
  has_special_background?: boolean;
  has_frame?: boolean;
  frame_size?: string;
  pet_names?: string[];
  background_description?: string;
  customizations?: Record<string, any>;
}

export interface CreatePaymentIntentInput {
  order_id: string;
  provider: PaymentIntent['provider'];
  provider_payment_id: string;
  amount: number;
  currency?: string;
  provider_data?: Record<string, any>;
  idempotency_key?: string;
}
