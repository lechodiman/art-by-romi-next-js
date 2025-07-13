import * as z from 'zod';
import { validateRUT, validateChileanPhone } from '@/lib/chile-locations';

// Personal information schema (Step 1)
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.email('Email inválido'),
  rut: z.string().refine((val) => validateRUT(val), {
    message: 'RUT inválido',
  }),
  phone: z.string().refine((val) => validateChileanPhone(val), {
    message: 'Número de teléfono inválido. Debe ser un número chileno',
  }),
});

// Shipping information schema (Step 2)
export const shippingInfoSchema = z.object({
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  additionalInfo: z.string().optional(),
  region: z.string().min(1, 'Debes seleccionar una región'),
  comuna: z.string().min(1, 'Debes seleccionar una comuna'),
});

// Export step schemas for individual form use
export const step1Schema = personalInfoSchema;
export const step2Schema = shippingInfoSchema;

// Complete checkout form schema (combines both steps)
export const checkoutFormSchema = personalInfoSchema.merge(shippingInfoSchema);

// Type exports
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ShippingInfo = z.infer<typeof shippingInfoSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
