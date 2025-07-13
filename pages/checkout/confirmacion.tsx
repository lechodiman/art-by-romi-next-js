import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { TypographyH1 } from '@/components/TypographyH1';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const router = useRouter();

  useEffect(() => {
    // Store order confirmation in localStorage to persist across page reloads
    const hasOrder = localStorage.getItem('orderConfirmed');
    if (!hasOrder) {
      // If no order confirmation, redirect to cart
      router.push('/carrito');
    } else {
      // Clear the flag after showing confirmation
      localStorage.removeItem('orderConfirmed');
    }
  }, [router]);

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='flex justify-center mb-6'>
            <CheckCircle className='w-20 h-20 text-green-500' />
          </div>
          
          <TypographyH1 className='mb-4'>¡Pedido Confirmado!</TypographyH1>
          
          <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
            <p className='text-lg mb-4'>
              Tu pedido ha sido recibido exitosamente.
            </p>
            
            <p className='text-gray-600 mb-6'>
              Recibirás un correo electrónico con los detalles de tu pedido y las instrucciones para el pago.
            </p>
            
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
              <p className='text-sm text-blue-800'>
                <strong>Importante:</strong> Este es un pedido de demostración. En un entorno de producción, 
                recibirías un correo con las instrucciones de pago y el número de seguimiento de tu pedido.
              </p>
            </div>
            
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>¿Qué sigue?</h3>
              <ul className='text-left space-y-2 text-gray-600'>
                <li>• Revisa tu correo electrónico para los detalles del pedido</li>
                <li>• Realiza el pago siguiendo las instrucciones enviadas</li>
                <li>• Una vez confirmado el pago, comenzaremos a trabajar en tu retrato</li>
                <li>• Recibirás actualizaciones sobre el progreso de tu pedido</li>
              </ul>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
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