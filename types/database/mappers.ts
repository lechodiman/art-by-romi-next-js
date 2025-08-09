import { CartItem, CartItemCustomizations } from '../core/cart';
import { Order, OrderItem, Payment, OrderStatus, PaymentStatus, PaymentMethod } from '../core/order';
import { CustomerInfo } from '../core/customer';
import { DBOrder, DBOrderItem, DBPaymentIntent, DBOrderStatus, DBPaymentStatus } from './tables';
import { TablesInsert, TablesUpdate } from '../generated/database.types';

/**
 * Maps database order status to application order status
 */
function dbStatusToOrderStatus(status: DBOrderStatus): OrderStatus {
  const statusMap: Record<DBOrderStatus, OrderStatus> = {
    'pending': 'pending',
    'processing': 'processing',
    'completed': 'delivered',
    'failed': 'cancelled',
    'cancelled': 'cancelled'
  };
  return statusMap[status] || 'pending';
}

/**
 * Maps application order status to database order status
 */
function orderStatusToDBStatus(status: OrderStatus): DBOrderStatus {
  const statusMap: Record<OrderStatus, DBOrderStatus> = {
    'pending': 'pending',
    'processing': 'processing',
    'paid': 'processing',
    'shipped': 'processing',
    'delivered': 'completed',
    'cancelled': 'cancelled',
    'refunded': 'cancelled'
  };
  return statusMap[status] || 'pending';
}

/**
 * Maps database payment status to application payment status
 */
function dbStatusToPaymentStatus(status: DBPaymentStatus): PaymentStatus {
  const statusMap: Record<DBPaymentStatus, PaymentStatus> = {
    'pending': 'pending',
    'processing': 'processing',
    'succeeded': 'succeeded',
    'failed': 'failed',
    'cancelled': 'cancelled',
    'refunded': 'cancelled'
  };
  return statusMap[status] || 'pending';
}

/**
 * Maps database order to application order
 */
export function dbOrderToOrder(dbOrder: DBOrder, items: OrderItem[], payment?: Payment): Order {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
    status: dbStatusToOrderStatus(dbOrder.status),
    totalAmount: dbOrder.total,
    customer: {
      id: dbOrder.customer_id || undefined,
      firstName: dbOrder.customer_first_name,
      lastName: dbOrder.customer_last_name,
      email: dbOrder.customer_email,
      phone: dbOrder.customer_phone,
      identification: dbOrder.customer_rut ? {
        type: 'RUT',
        number: dbOrder.customer_rut,
      } : undefined,
    },
    items,
    payment,
    shipping: {
      method: 'standard',
      cost: dbOrder.shipping_cost || 0,
      address: {
        street: dbOrder.shipping_address,
        city: dbOrder.shipping_comuna,
        state: dbOrder.shipping_region,
        postalCode: '',
        country: 'Chile',
      },
    },
    notes: dbOrder.notes || undefined,
  };
}

/**
 * Maps database order item to application order item
 */
export function dbOrderItemToOrderItem(dbItem: DBOrderItem): OrderItem {
  const customizations: CartItemCustomizations = {
    extraPets: dbItem.pet_count || 0,
    hasSpecialBackground: dbItem.has_special_background || false,
    hasFrame: dbItem.has_frame || false,
    petNames: dbItem.pet_names || [],
    backgroundDescription: dbItem.background_description || undefined,
  };
  
  return {
    cartItemId: dbItem.id,
    orderId: dbItem.order_id,
    productId: dbItem.product_id,
    quantity: dbItem.quantity,
    unitPrice: dbItem.unit_price,
    totalPrice: dbItem.total_price,
    customizations,
  };
}

/**
 * Maps database payment intent to application payment
 */
export function dbPaymentIntentToPayment(dbPayment: DBPaymentIntent): Payment {
  return {
    id: dbPayment.id,
    orderId: dbPayment.order_id,
    method: dbPayment.provider as PaymentMethod,
    status: dbStatusToPaymentStatus(dbPayment.status),
    amount: dbPayment.amount,
    currency: dbPayment.currency,
    transactionId: dbPayment.provider_payment_id,
    paymentDate: new Date(dbPayment.updated_at),
    metadata: dbPayment.provider_data as Record<string, any> || undefined,
  };
}

/**
 * Maps application order to database order insert
 */
export function orderToDBOrderInsert(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, orderNumber: string): TablesInsert<'orders'> {
  return {
    order_number: orderNumber,
    status: orderStatusToDBStatus(order.status),
    total: order.totalAmount,
    subtotal: order.totalAmount, // Calculate if needed
    customer_id: order.customer.id || null,
    customer_email: order.customer.email,
    customer_first_name: order.customer.firstName,
    customer_last_name: order.customer.lastName,
    customer_phone: order.customer.phone || '',
    customer_rut: order.customer.identification?.number || '',
    shipping_address: order.shipping?.address.street || '',
    shipping_comuna: order.shipping?.address.city || '',
    shipping_region: order.shipping?.address.state || '',
    shipping_cost: order.shipping?.cost || null,
    shipping_additional_info: null,
    notes: order.notes || null,
    metadata: null,
  };
}

/**
 * Maps application order item to database order item insert
 */
export function orderItemToDBOrderItemInsert(item: OrderItem, productName: string): TablesInsert<'order_items'> {
  return {
    order_id: item.orderId,
    product_id: item.productId,
    product_name: productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
    pet_count: item.customizations?.extraPets || null,
    has_special_background: item.customizations?.hasSpecialBackground || null,
    has_frame: item.customizations?.hasFrame || null,
    pet_names: item.customizations?.petNames || null,
    background_description: item.customizations?.backgroundDescription || null,
    frame_size: null,
    product_slug: null,
    customizations: item.customizations as any || null,
  };
}

/**
 * Maps application payment to database payment intent insert
 */
export function paymentToDBPaymentIntentInsert(payment: Omit<Payment, 'id'>, providerPaymentId: string): TablesInsert<'payment_intents'> {
  return {
    order_id: payment.orderId,
    provider: payment.method,
    provider_payment_id: providerPaymentId,
    status: payment.status as DBPaymentStatus,
    amount: payment.amount,
    currency: payment.currency,
    provider_data: payment.metadata || null,
    error_code: null,
    error_message: null,
    idempotency_key: null,
  };
}

/**
 * Maps cart item to database order item (for checkout)
 */
export function cartItemToDBOrderItem(
  item: CartItem,
  orderId: string,
  productName: string,
  unitPrice: number
): TablesInsert<'order_items'> {
  const totalPrice = unitPrice * item.quantity;
  
  return {
    order_id: orderId,
    product_id: item.productId,
    product_name: productName,
    quantity: item.quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    pet_count: item.customizations?.extraPets || null,
    has_special_background: item.customizations?.hasSpecialBackground || null,
    has_frame: item.customizations?.hasFrame || null,
    pet_names: item.customizations?.petNames || null,
    background_description: item.customizations?.backgroundDescription || null,
    frame_size: null,
    product_slug: null,
    customizations: item.customizations as any || null,
  };
}