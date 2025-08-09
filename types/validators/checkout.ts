import { z } from 'zod';
import { cartItemSchema } from './cart';

export const customerInfoSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  identification: z.object({
    type: z.string().min(1),
    number: z.string().min(1),
  }).optional(),
});

export const checkoutRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  customer: customerInfoSchema,
  paymentMethod: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  identification: z.object({
    type: z.enum(['DNI', 'CUIT', 'CUIL', 'PASSPORT']),
    number: z.string().min(1, 'Identification number is required'),
  }),
  notes: z.string().max(1000).optional(),
});

export type ValidatedCustomerInfo = z.infer<typeof customerInfoSchema>;
export type ValidatedCheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type ValidatedCheckoutForm = z.infer<typeof checkoutFormSchema>;

export function validateCustomerInfo(data: unknown): ValidatedCustomerInfo {
  return customerInfoSchema.parse(data);
}

export function validateCheckoutRequest(data: unknown): ValidatedCheckoutRequest {
  return checkoutRequestSchema.parse(data);
}

export function validateCheckoutForm(data: unknown): ValidatedCheckoutForm {
  return checkoutFormSchema.parse(data);
}