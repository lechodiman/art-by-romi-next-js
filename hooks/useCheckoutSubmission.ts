import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useCartActions } from '@/context/CartContext';
import { OrderData } from '@/types/checkout';

export function useCheckoutSubmission() {
  const router = useRouter();
  const { clearCart } = useCartActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = useCallback(async (orderData: OrderData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would normally process the payment
      // For now, we'll just log the order
      console.log('Order submitted:', orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
      router.push('/');
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error al procesar el pedido');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [clearCart, router]);

  return {
    submitOrder,
    isSubmitting
  };
}