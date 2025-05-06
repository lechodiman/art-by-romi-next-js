import { TypographyH1 } from '@/components/TypographyH1';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/Product';

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Retrato Mini',
    description: 'Retrato personalizado, óleo sobre tela tamaño Mini 20cm x 25cm',
    price: 40000,
    images: ['/images/product1.jpg'],
    category: 'retratos',
  },
  // Agrega más productos aquí
];

export default function Tienda() {
  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container px-5 mx-auto py-14'>
        <TypographyH1 className='mb-10 text-center'>Tienda</TypographyH1>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {dummyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
