import { createClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate, Enums } from '@/types';

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Type aliases for cleaner code
type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;
type PaymentIntent = Tables<'payment_intents'>;
type CreateOrderInput = Omit<TablesInsert<'orders'>, 'id' | 'created_at' | 'updated_at' | 'order_number' | 'status'>;
type CreateOrderItemInput = Omit<TablesInsert<'order_items'>, 'id' | 'created_at' | 'order_id'>;
type CreatePaymentIntentInput = Omit<TablesInsert<'payment_intents'>, 'id' | 'created_at' | 'updated_at'>;
type OrderStatus = Enums<'order_status'>;
type PaymentStatus = Enums<'payment_status'>;

export class OrderService {
  /**
   * Generate a unique order number
   */
  private static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Create a new order with items
   */
  static async createOrder(
    orderData: CreateOrderInput,
    items: CreateOrderItemInput[]
  ): Promise<Order> {
    try {
      // Start a transaction by creating the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          order_number: this.generateOrderNumber(),
          status: 'pending' as OrderStatus,
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error(orderError?.message || 'Failed to create order');
      }

      // Create order items
      const orderItems = items.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) {
        // Rollback by deleting the order
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(itemsError.message);
      }

      return order;
    } catch (error: any) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Get order by ID
   */
  static async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  }

  /**
   * Get order by order number
   */
  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.error('Error fetching order by number:', error);
      return null;
    }

    return data;
  }

  /**
   * Get order items
   */
  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      console.error('Error fetching order items:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const updateData: any = { status };

    if (metadata) {
      updateData.metadata = metadata;
    }

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  }

  /**
   * Create a payment intent record
   */
  static async createPaymentIntent(
    data: CreatePaymentIntentInput
  ): Promise<PaymentIntent> {
    const { data: intent, error } = await supabase
      .from('payment_intents')
      .insert(data)
      .select()
      .single();

    if (error || !intent) {
      throw new Error(error?.message || 'Failed to create payment intent');
    }

    return intent;
  }

  /**
   * Update payment intent status
   */
  static async updatePaymentIntent(
    intentId: string,
    updates: {
      status?: PaymentStatus;
      provider_data?: Record<string, any>;
      error_code?: string;
      error_message?: string;
    }
  ): Promise<boolean> {
    const { error } = await supabase
      .from('payment_intents')
      .update(updates)
      .eq('id', intentId);

    if (error) {
      console.error('Error updating payment intent:', error);
      return false;
    }

    return true;
  }

  /**
   * Get payment intent by provider payment ID
   */
  static async getPaymentIntentByProviderId(
    provider: string,
    providerPaymentId: string
  ): Promise<PaymentIntent | null> {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('provider', provider)
      .eq('provider_payment_id', providerPaymentId)
      .single();

    if (error) {
      console.error('Error fetching payment intent:', error);
      return null;
    }

    return data;
  }

  /**
   * Get all payment intents for an order
   */
  static async getOrderPaymentIntents(orderId: string): Promise<PaymentIntent[]> {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment intents:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Check if an idempotency key exists
   */
  static async getPaymentIntentByIdempotencyKey(
    key: string
  ): Promise<PaymentIntent | null> {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('idempotency_key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Not found error
      console.error('Error checking idempotency key:', error);
    }

    return data;
  }
}
