import { z } from 'zod';

export const productSizeSchema = z.enum(['mini', 'medium', 'large']);
export const productCategorySchema = z.enum(['retratos']);

export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  size: productSizeSchema,
  category: productCategorySchema,
  images: z.array(z.string()),
});

export const productCustomizationSchema = z.object({
  extraPets: z.number().min(0).max(10),
  hasSpecialBackground: z.boolean(),
  hasFrame: z.boolean(),
  petNames: z.array(z.string()).optional(),
  backgroundDescription: z.string().max(500).optional(),
});

export const customizedProductSchema = productSchema.extend({
  customization: productCustomizationSchema,
  finalPrice: z.number().positive(),
});

export type ValidatedProduct = z.infer<typeof productSchema>;
export type ValidatedProductCustomization = z.infer<typeof productCustomizationSchema>;
export type ValidatedCustomizedProduct = z.infer<typeof customizedProductSchema>;

export function validateProduct(data: unknown): ValidatedProduct {
  return productSchema.parse(data);
}

export function validateProductCustomization(data: unknown): ValidatedProductCustomization {
  return productCustomizationSchema.parse(data);
}