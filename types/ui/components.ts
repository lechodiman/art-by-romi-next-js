import { ReactNode } from 'react';
import { ProductWithImages } from '../core/product';
import { CartItemWithProduct } from '../core/cart';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface ProductCardProps {
  product: ProductWithImages;
  onAddToCart?: (product: ProductWithImages) => void;
  showQuickView?: boolean;
}

export interface CartItemCardProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  editable?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}