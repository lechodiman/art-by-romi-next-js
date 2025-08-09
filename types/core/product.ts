import type { Product as SanityProduct } from '../../sanity.types';

export type ProductSize = 'mini' | 'medium' | 'large';
export type ProductCategory = 'retratos';

export interface BaseProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  size: ProductSize;
  category: ProductCategory;
}

export interface ProductWithImages extends BaseProduct {
  images: string[];
}

export type Product = SanityProduct;

export interface ProductCustomization {
  extraPets: number;
  hasSpecialBackground: boolean;
  hasFrame: boolean;
  petNames?: string[];
  backgroundDescription?: string;
}

export interface CustomizedProduct extends ProductWithImages {
  customization: ProductCustomization;
  finalPrice: number;
}