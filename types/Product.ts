export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  size: 'mini' | 'medium' | 'large';
}
