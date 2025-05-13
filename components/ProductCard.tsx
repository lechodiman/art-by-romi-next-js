import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className='overflow-hidden bg-white rounded-lg shadow-md'>
      {/* Cambiar el div de la imagen para que tenga proporción vertical 4:5 */}
      <div className='relative w-full pt-[125%]'>
        {' '}
        {/* 125% = 5/4 = proporción vertical */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
      <div className='p-4 space-y-3'>
        <h2 className='text-xl font-semibold text-gray-800'>{product.name}</h2>
        <p className='text-sm text-gray-600 line-clamp-2'>{product.description}</p>
        <p className='text-lg font-bold text-gray-900'>
          {product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
        </p>
        <div className='flex space-x-3'>
          <Link
            href={`/tienda/${product._id}`}
            className='flex-1 px-4 py-2 text-center transition-colors rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          >
            Ver
          </Link>
          <button
            onClick={() => {
              /* Implementar lógica del carrito */
            }}
            className='flex-1 px-4 py-2 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600'
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
