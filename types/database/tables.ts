import { Tables, Enums } from '../generated/database.types';

// Use generated Supabase types directly
export type DBOrder = Tables<'orders'>;
export type DBOrderItem = Tables<'order_items'>;
export type DBPaymentIntent = Tables<'payment_intents'>;

// Export enums
export type DBOrderStatus = Enums<'order_status'>;
export type DBPaymentStatus = Enums<'payment_status'>;

// Type guards
export function isDBOrder(data: unknown): data is DBOrder {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'order_number' in data &&
    'total' in data
  );
}

export function isDBOrderItem(data: unknown): data is DBOrderItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'order_id' in data &&
    'product_id' in data
  );
}

export function isDBPaymentIntent(data: unknown): data is DBPaymentIntent {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'order_id' in data &&
    'amount' in data
  );
}