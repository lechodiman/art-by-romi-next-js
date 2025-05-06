import { TypographyH1 } from '@/components/TypographyH1';
import { Product } from '@/types/Product';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Aquí deberías obtener los detalles del producto según el ID
  const product: Product = {
    id: '1',
    name: 'Retrato a Lápiz',
    description: 'Retrato personalizado en lápiz grafito sobre papel',
    price: 25000,
    images: ['/images/product1.jpg'],
    category: 'retratos',
  };

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container px-5 mx-auto py-14'>
        <div className='max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-md'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='relative h-96'>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className='object-cover rounded-lg'
              />
            </div>
            <div className='space-y-4'>
              <TypographyH1>{product.name}</TypographyH1>
              <p className='text-gray-600'>{product.description}</p>
              <p className='text-2xl font-bold text-gray-900'>
                ${product.price.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  /* Implementar lógica del carrito */
                }}
                className='w-full px-6 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600'
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
