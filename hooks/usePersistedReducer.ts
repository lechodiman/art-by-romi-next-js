import { useReducer, useEffect, useRef, Reducer, Dispatch } from 'react';

export function usePersistedReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  storageKey: string,
  storage: Storage = typeof window !== 'undefined' ? localStorage : null as any
): [S, Dispatch<A>] {
  // Always start with initialState to avoid hydration mismatch
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Track if we've loaded from storage
  const hasLoadedRef = useRef(false);
  
  // Load from storage after mount (client-side only)
  useEffect(() => {
    if (hasLoadedRef.current || !storage) return;
    
    try {
      const stored = storage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Create a hydrate action to load the stored state
        dispatch({ type: 'HYDRATE', payload: parsed } as A);
      }
    } catch (error) {
      console.error(`Error loading ${storageKey} from storage:`, error);
    }
    
    hasLoadedRef.current = true;
  }, [storageKey, storage]);
  
  // Save to storage whenever state changes (skip first render)
  useEffect(() => {
    if (!hasLoadedRef.current || !storage) return;
    
    try {
      storage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving ${storageKey} to storage:`, error);
    }
  }, [state, storageKey, storage]);
  
  return [state, dispatch];
}