import { usePersistedCartReducer } from '@/hooks/usePersistedCartReducer';
import { CartItem } from '@/types';
import { createContext, useContext, useMemo } from 'react';

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  selectors: {
    getTotalItems: () => number;
    getTotalUniqueItems: () => number;
    getItemByCartId: (cartItemId: string) => CartItem | undefined;
    getItemsByProductId: (productId: string) => CartItem[];
  };
  actions: {
    addToCart: (item: CartItem) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const generateCartItemId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const areItemsEqual = (item1: CartItem, item2: CartItem) => {
  const getPetCount = (item: CartItem) => (item.customizations?.extraPets || 0) + 1;
  const hasBackground = (item: CartItem) =>
    item.customizations?.hasSpecialBackground || false;
  const hasFrame = (item: CartItem) => item.customizations?.hasFrame || false;

  return (
    item1.productId === item2.productId &&
    getPetCount(item1) === getPetCount(item2) &&
    hasBackground(item1) === hasBackground(item2) &&
    hasFrame(item1) === hasFrame(item2)
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex((item) =>
        areItemsEqual(item, newItem)
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...newItem, cartItemId: generateCartItemId() }],
      };
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.cartItemId !== action.payload.cartItemId
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.cartItemId === action.payload.cartItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = usePersistedCartReducer(cartReducer, initialState);

  const selectors = useMemo(
    () => ({
      getTotalItems: () => state.items.reduce((total, item) => total + item.quantity, 0),
      getTotalUniqueItems: () => state.items.length,
      getItemByCartId: (cartItemId: string) =>
        state.items.find((item) => item.cartItemId === cartItemId),
      getItemsByProductId: (productId: string) =>
        state.items.filter((item) => item.productId === productId),
    }),
    [state.items]
  );

  const actions = useMemo(
    () => ({
      addToCart: (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item }),
      removeFromCart: (cartItemId: string) =>
        dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } }),
      updateQuantity: (cartItemId: string, quantity: number) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    [dispatch]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      selectors,
      actions,
    }),
    [state, selectors, actions, dispatch]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useCartItems() {
  const { state } = useCart();
  return state.items;
}

export function useCartActions() {
  const { actions } = useCart();
  return actions;
}

export function useCartSelectors() {
  const { selectors } = useCart();
  return selectors;
}
