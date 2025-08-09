import { z } from 'zod';

export const cartItemCustomizationsSchema = z.object({
  extraPets: z.number().min(0).max(10).optional(),
  hasSpecialBackground: z.boolean().optional(),
  hasFrame: z.boolean().optional(),
  petNames: z.array(z.string()).optional(),
  backgroundDescription: z.string().max(500).optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1).max(99),
  cartItemId: z.string().min(1),
  customizations: cartItemCustomizationsSchema.optional(),
});

export const cartItemWithProductSchema = cartItemSchema.extend({
  product: z.object({
    name: z.string(),
    price: z.number().positive(),
    images: z.array(z.string()),
    size: z.enum(['mini', 'medium', 'large']),
  }),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1).max(99),
  customizations: cartItemCustomizationsSchema.optional(),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().min(1).max(99).optional(),
  customizations: cartItemCustomizationsSchema.optional(),
});

export type ValidatedCartItem = z.infer<typeof cartItemSchema>;
export type ValidatedCartItemWithProduct = z.infer<typeof cartItemWithProductSchema>;
export type ValidatedAddToCart = z.infer<typeof addToCartSchema>;
export type ValidatedUpdateCartItem = z.infer<typeof updateCartItemSchema>;

export function isValidCartItem(item: unknown): item is ValidatedCartItem {
  return cartItemSchema.safeParse(item).success;
}

export function validateCartItem(item: unknown): ValidatedCartItem {
  return cartItemSchema.parse(item);
}

export function validateAddToCart(data: unknown): ValidatedAddToCart {
  return addToCartSchema.parse(data);
}

export function validateUpdateCartItem(data: unknown): ValidatedUpdateCartItem {
  return updateCartItemSchema.parse(data);
}