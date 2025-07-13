import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { ValidatedCartItem, ValidateCartResponse } from '@/types/checkout';
import { CartItem } from '@/context/CartContext';

export function useCartValidation(items: CartItem[]) {
  const router = useRouter();
  const [validatedItems, setValidatedItems] = useState<ValidatedCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCart = useCallback(async () => {
    if (items.length === 0) {
      router.push('/carrito');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const apiItems = items.map(item => ({
        cartItemId: item.cartItemId || '',
        productId: item.productId,
        quantity: item.quantity,
        customizations: {
          extraPets: parseInt(item.petCount) || 0,
          hasSpecialBackground: item.options.includes('special-background'),
          hasFrame: item.options.includes('frame')
        }
      }));

      const response = await fetch('/api/validate-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: apiItems }),
      });

      if (response.ok) {
        const data: ValidateCartResponse = await response.json();
        if (!data.valid) {
          toast.error('Algunos productos no están disponibles');
          router.push('/carrito');
          return;
        }
        setValidatedItems(data.items);
        setCartTotal(data.total);
      } else {
        throw new Error('Error al validar el carrito');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el carrito';
      setError(errorMessage);
      toast.error(errorMessage);
      router.push('/carrito');
    } finally {
      setIsValidating(false);
    }
  }, [items, router]);

  useEffect(() => {
    validateCart();
  }, [validateCart]);

  return {
    validatedItems,
    cartTotal,
    isValidating,
    error,
    validateCart
  };
}