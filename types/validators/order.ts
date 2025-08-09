import { z } from 'zod';
import { cartItemSchema } from './cart';
import { customerInfoSchema } from './checkout';

export const orderStatusSchema = z.enum([
  'pending',
  'processing',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

export const paymentStatusSchema = z.enum([
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
]);

export const paymentMethodSchema = z.enum([
  'mercadopago',
  'bank_transfer',
  'cash',
]);

export const orderItemSchema = cartItemSchema.extend({
  orderId: z.string(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const paymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  amount: z.number().positive(),
  currency: z.string().length(3),
  transactionId: z.string().optional(),
  paymentDate: z.date().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const shippingInfoSchema = z.object({
  method: z.string(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.date().optional(),
  actualDelivery: z.date().optional(),
  cost: z.number().nonnegative(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: orderStatusSchema,
  totalAmount: z.number().positive(),
  customer: customerInfoSchema,
  items: z.array(orderItemSchema).min(1),
  payment: paymentSchema.optional(),
  shipping: shippingInfoSchema.optional(),
  notes: z.string().optional(),
});

export type ValidatedOrder = z.infer<typeof orderSchema>;
export type ValidatedOrderItem = z.infer<typeof orderItemSchema>;
export type ValidatedPayment = z.infer<typeof paymentSchema>;
export type ValidatedShippingInfo = z.infer<typeof shippingInfoSchema>;

export function validateOrder(data: unknown): ValidatedOrder {
  return orderSchema.parse(data);
}

export function validateOrderItem(data: unknown): ValidatedOrderItem {
  return orderItemSchema.parse(data);
}

export function validatePayment(data: unknown): ValidatedPayment {
  return paymentSchema.parse(data);
}