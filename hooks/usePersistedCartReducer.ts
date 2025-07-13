import { CartItem } from '@/context/CartContext';
import { usePersistedReducer } from './usePersistedReducer';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState };

export function usePersistedCartReducer(
  baseReducer: (state: CartState, action: any) => CartState,
  initialState: CartState
) {
  // Wrap the base reducer to handle HYDRATE action
  const reducerWithHydrate = (state: CartState, action: CartAction): CartState => {
    if (action.type === 'HYDRATE') {
      // When hydrating, we want to preserve any cart item IDs that might be missing
      const hydratedItems = action.payload.items.map(item => ({
        ...item,
        cartItemId: item.cartItemId || Math.random().toString(36).substring(2) + Date.now().toString(36)
      }));
      return { ...state, items: hydratedItems };
    }
    return baseReducer(state, action);
  };

  return usePersistedReducer(
    reducerWithHydrate,
    initialState,
    'cart-items',
    typeof window !== 'undefined' ? localStorage : null as any
  );
}