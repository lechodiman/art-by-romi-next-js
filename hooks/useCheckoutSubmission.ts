import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useCartActions, useCartItems } from '@/context/CartContext';
import { OrderData, CartCustomizations } from '@/types/checkout';

interface PaymentIntentResponse {
  id: string;
  clientSecret?: string;
  status: string;
  amount: number;
  currency: string;
  redirectUrl?: string;
  additionalData?: any;
}

export function useCheckoutSubmission() {
  const { clearCart } = useCartActions();
  const cartItems = useCartItems();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);

  // Convert CartItem options to customizations format
  const cartItemToCustomizations = useCallback((item: typeof cartItems[0]): CartCustomizations => {
    const customizations: CartCustomizations = {};
    
    // Convert petCount to number
    const petCount = parseInt(item.petCount || '1', 10);
    if (petCount > 1) {
      customizations.extraPets = petCount - 1;
    }
    
    // Check for special background
    if (item.options.includes('special-background')) {
      customizations.hasSpecialBackground = true;
    }
    
    // Check for frame
    if (item.options.includes('frame')) {
      customizations.hasFrame = true;
    }
    
    return customizations;
  }, []);

  const createOrder = useCallback(async (orderData: OrderData) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: orderData.customer,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            customizations: cartItemToCustomizations(item)
          })),
          metadata: {
            createdAt: orderData.createdAt
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [cartItems, cartItemToCustomizations]);

  const createPaymentIntent = useCallback(async (orderData: OrderData, orderId: string) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'mercadopago',
          orderId,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            customizations: cartItemToCustomizations(item)
          })),
          customer: {
            email: orderData.customer.email,
            firstName: orderData.customer.firstName,
            lastName: orderData.customer.lastName,
            rut: orderData.customer.rut,
            phone: orderData.customer.phone
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }, [cartItems, cartItemToCustomizations]);

  const submitOrder = useCallback(async (orderData: OrderData) => {
    setIsSubmitting(true);
    
    try {
      // Step 1: Create order in database
      const order = await createOrder(orderData);
      
      // Step 2: Create payment intent
      const intent = await createPaymentIntent(orderData, order.id);
      setPaymentIntent(intent);
      
      // Step 3: Handle payment flow based on provider
      if (intent.redirectUrl) {
        // For redirect-based payments (like MercadoPago)
        // Store order confirmation flag before redirecting
        localStorage.setItem('orderConfirmed', 'true');
        localStorage.setItem('orderId', order.id);
        
        // Redirect to payment gateway
        window.location.href = intent.redirectUrl;
      } else {
        // For embedded payment forms (future implementation)
        // Would handle client-side payment confirmation here
        toast.error('Método de pago no implementado');
        return { success: false };
      }
      
      return { success: true, orderId: order.id, paymentIntent: intent };
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error al procesar el pedido');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [createOrder, createPaymentIntent]);

  return {
    submitOrder,
    isSubmitting,
    paymentIntent
  };
}