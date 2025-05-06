import { TypographyH1 } from '@/components/TypographyH1';

export default function Carrito() {
  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <TypographyH1 className='text-center'>Mi Carrito</TypographyH1>
        <div className='max-w-2xl p-6 mx-auto bg-white rounded-lg shadow'>
          <p className='text-center text-gray-500'>Tu carrito está vacío</p>
        </div>
      </section>
    </main>
  );
}
