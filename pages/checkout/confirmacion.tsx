import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TypographyH1 } from '@/components/TypographyH1';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useCartActions } from '@/context/CartContext';

export default function OrderConfirmation() {
  const router = useRouter();
  const { clearCart } = useCartActions();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | 'pending'>('pending');
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    // Check for order confirmation and payment status
    const hasOrder = localStorage.getItem('orderConfirmed');
    const orderId = localStorage.getItem('orderId');
    
    // Get payment status from URL params (MercadoPago callback)
    const { status, payment_id, external_reference } = router.query;
    
    if (!hasOrder && !status) {
      // If no order confirmation and no payment callback, redirect to cart
      router.push('/carrito');
      return;
    }

    // Handle MercadoPago callback
    if (status === 'approved') {
      setPaymentStatus('success');
      clearCart(); // Clear cart only on successful payment
      // Set order number from external reference if available
      if (external_reference) {
        setOrderNumber(external_reference as string);
      }
    } else if (status === 'rejected' || status === 'cancelled') {
      setPaymentStatus('failure');
    }
    
    // Clear localStorage flags
    localStorage.removeItem('orderConfirmed');
    localStorage.removeItem('orderId');
  }, [router, clearCart]);

  if (paymentStatus === 'pending') {
    return (
      <main className='flex-grow bg-gray-100'>
        <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
          <div className='max-w-2xl mx-auto text-center'>
            <p className='text-lg'>Procesando tu pedido...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='flex justify-center mb-6'>
            {paymentStatus === 'success' ? (
              <CheckCircle className='w-20 h-20 text-green-500' />
            ) : (
              <AlertCircle className='w-20 h-20 text-red-500' />
            )}
          </div>
          
          <TypographyH1 className='mb-4'>
            {paymentStatus === 'success' ? '¡Pago Confirmado!' : 'Pago No Completado'}
          </TypographyH1>
          
          {paymentStatus === 'success' ? (
            <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
              <p className='text-lg mb-4'>
                Tu pago ha sido procesado exitosamente.
              </p>
              
              {orderNumber && (
                <p className='text-gray-600 mb-4'>
                  Número de orden: <strong>{orderNumber}</strong>
                </p>
              )}
              
              <p className='text-gray-600 mb-6'>
                Recibirás un correo electrónico con los detalles de tu pedido y los próximos pasos.
              </p>
              
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>¿Qué sigue?</h3>
                <ul className='text-left space-y-2 text-gray-600'>
                  <li>• Revisa tu correo electrónico para los detalles del pedido</li>
                  <li>• Te contactaremos pronto para coordinar los detalles de tu retrato</li>
                  <li>• Comenzaremos a trabajar en tu retrato personalizado</li>
                  <li>• Recibirás actualizaciones sobre el progreso de tu pedido</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
              <p className='text-lg mb-4'>
                No se pudo completar el pago de tu pedido.
              </p>
              
              <p className='text-gray-600 mb-6'>
                Puedes intentar nuevamente o contactarnos si necesitas ayuda.
              </p>
              
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <p className='text-sm text-yellow-800'>
                  Tu carrito ha sido guardado y puedes intentar el pago nuevamente cuando lo desees.
                </p>
              </div>
            </div>
          )}
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            {paymentStatus === 'failure' && (
              <Button 
                onClick={() => router.push('/carrito')}
                className='bg-zinc-700 hover:bg-zinc-600'
              >
                Volver al Carrito
              </Button>
            )}
            <Button 
              onClick={() => router.push('/')}
              variant='outline'
            >
              Volver al Inicio
            </Button>
            <Button 
              onClick={() => router.push('/tienda')}
              className='bg-zinc-700 hover:bg-zinc-600'
            >
              Seguir Comprando
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}