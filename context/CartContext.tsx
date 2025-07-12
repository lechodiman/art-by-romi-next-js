import { createContext, useContext, useState } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  options: string[];
  petCount: string;
  cartItemId?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const generateCartItemId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const areItemsEqual = (item1: CartItem, item2: CartItem) => {
    return (
      item1.productId === item2.productId &&
      item1.petCount === item2.petCount &&
      item1.options.length === item2.options.length &&
      item1.options.every((opt) => item2.options.includes(opt))
    );
  };

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existingItemIndex = prev.findIndex((prevItem) => areItemsEqual(prevItem, item));
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        return updatedItems;
      }
      
      return [...prev, { ...item, cartItemId: generateCartItemId() }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
