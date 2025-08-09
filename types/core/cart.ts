export interface BaseCartItem {
  productId: string;
  quantity: number;
}

export interface CartItemCustomizations {
  extraPets?: number;
  hasSpecialBackground?: boolean;
  hasFrame?: boolean;
  petNames?: string[];
  backgroundDescription?: string;
}

export interface CartItem extends BaseCartItem {
  cartItemId: string;
  customizations?: CartItemCustomizations;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    name: string;
    price: number;
    images: string[];
    size: 'mini' | 'medium' | 'large';
  };
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  totals: CartTotals;
}