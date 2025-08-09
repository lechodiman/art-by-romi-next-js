import { TypographyH1 } from '@/components/TypographyH1';
import { CartItem } from '@/types';
import type { ProductByIdQueryResult, AllProductsQueryResult } from '@/sanity.types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getClient } from '@/sanity/lib/client';
import { allProductsQuery, productByIdQuery } from '@/sanity/lib/queries';
import { useCartActions } from '@/context/CartContext';
import { toast } from 'sonner';

type Product = NonNullable<ProductByIdQueryResult>;

interface PriceBreakdown {
  basePrice: number;
  extraPetsPrice: number;
  backgroundPrice: number;
  framePrice: number;
}

interface PriceResponse {
  basePrice: number;
  totalPrice: number;
  breakdown: PriceBreakdown;
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [petCount, setPetCount] = useState('0');
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const { addToCart } = useCartActions();

  // Fetch price from server whenever customizations change
  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoadingPrice(true);
      try {
        const customizations = {
          extraPets: parseInt(petCount) || 0,
          hasSpecialBackground: selectedOptions.includes('special-background'),
          hasFrame: selectedOptions.includes('frame'),
        };

        const response = await fetch('/api/calculate-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id,
            customizations,
          }),
        });

        if (response.ok) {
          const data: PriceResponse = await response.json();
          setTotalPrice(data.totalPrice);
          setPriceBreakdown(data.breakdown);
        } else {
          console.error('Failed to calculate price');
          // Fallback to base price on error
          setTotalPrice(product.price);
        }
      } catch (error) {
        console.error('Error calculating price:', error);
        setTotalPrice(product.price);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [product._id, product.price, selectedOptions, petCount]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container px-5 mx-auto py-14'>
        <div className='max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-md'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {/* Cambiar el div de la imagen para que tenga proporción vertical 4:5 */}
            <div className='relative w-full pt-[125%]'>
              {' '}
              {/* 125% = 5/4 = proporción vertical */}
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className='object-cover rounded-lg'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>

            <div className='space-y-6'>
              <TypographyH1>{product.name}</TypographyH1>
              <p className='text-gray-600'>{product.description}</p>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>Personalización</h3>
                {/* Extra pets option */}
                <div className='p-4 space-y-2 rounded-lg bg-gray-50'>
                  <div>
                    <label className='block mb-2 font-medium text-gray-900'>
                      Agregar mascota(s) (opcional)
                    </label>
                    <select
                      value={petCount}
                      onChange={(e) => {
                        setPetCount(e.target.value);
                        if (e.target.value === '0') {
                          setSelectedOptions((prev) =>
                            prev.filter((id) => id !== 'extra-pet')
                          );
                        } else if (!selectedOptions.includes('extra-pet')) {
                          setSelectedOptions((prev) => [...prev, 'extra-pet']);
                        }
                      }}
                      className='w-full border-gray-300 rounded-md shadow-sm focus:border-zinc-500 focus:ring-zinc-500'
                    >
                      <option value='0'>Sin mascota adicional</option>
                      <option value='1'>
                        1 mascota adicional
                        {priceBreakdown &&
                          petCount === '1' &&
                          ` (+$${priceBreakdown.extraPetsPrice.toLocaleString('es-CL')})`}
                      </option>
                      <option value='2'>
                        2 mascotas adicionales
                        {priceBreakdown &&
                          petCount === '2' &&
                          ` (+$${priceBreakdown.extraPetsPrice.toLocaleString('es-CL')})`}
                      </option>
                    </select>
                  </div>
                  <p className='text-sm text-gray-600'>
                    Incluye mascota(s) adicional(es) en el retrato
                  </p>
                </div>

                {/* Special background option */}
                <div className='p-4 space-y-2 rounded-lg bg-gray-50'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={selectedOptions.includes('special-background')}
                      onChange={() => toggleOption('special-background')}
                      className='w-4 h-4 rounded text-zinc-700 focus:ring-zinc-500'
                    />
                    <span className='font-medium text-gray-900'>
                      Fondo especial (opcional)
                    </span>
                  </label>
                  <p className='text-sm text-gray-600'>
                    Añade un fondo personalizado al retrato
                    {priceBreakdown &&
                      priceBreakdown.backgroundPrice > 0 &&
                      ` (+$${priceBreakdown.backgroundPrice.toLocaleString('es-CL')})`}
                    . Si no seleccionas esta opción, el fondo será de un solo color.
                  </p>
                </div>

                {/* Frame option */}
                <div className='p-4 space-y-2 rounded-lg bg-gray-50'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={selectedOptions.includes('frame')}
                      onChange={() => toggleOption('frame')}
                      className='w-4 h-4 rounded text-zinc-700 focus:ring-zinc-500'
                    />
                    <span className='font-medium text-gray-900'>
                      Añadir marco (opcional)
                    </span>
                  </label>
                  <p className='text-sm text-gray-600'>
                    Añade un marco decorativo al retrato
                    {priceBreakdown &&
                      priceBreakdown.framePrice > 0 &&
                      ` (+$${priceBreakdown.framePrice.toLocaleString('es-CL')})`}
                    . El retrato viene por defecto sin marco.
                  </p>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-200'>
                <p className='text-2xl font-bold text-gray-900'>
                  {isLoadingPrice ? (
                    <span className='text-gray-400'>Calculando...</span>
                  ) : (
                    `$${totalPrice.toLocaleString('es-CL')}`
                  )}
                </p>
                {(selectedOptions.length > 0 || parseInt(petCount) > 0) &&
                  priceBreakdown && (
                    <div className='mt-2 space-y-1 text-sm text-gray-600'>
                      <p>Precio base: ${product.price.toLocaleString('es-CL')}</p>
                      {priceBreakdown.extraPetsPrice > 0 && (
                        <p>
                          Mascotas adicionales: +$
                          {priceBreakdown.extraPetsPrice.toLocaleString('es-CL')}
                        </p>
                      )}
                      {priceBreakdown.backgroundPrice > 0 && (
                        <p>
                          Fondo especial: +$
                          {priceBreakdown.backgroundPrice.toLocaleString('es-CL')}
                        </p>
                      )}
                      {priceBreakdown.framePrice > 0 && (
                        <p>
                          Marco: +${priceBreakdown.framePrice.toLocaleString('es-CL')}
                        </p>
                      )}
                    </div>
                  )}
              </div>

              <button
                onClick={() => {
                  const cartItem: CartItem = {
                    cartItemId: Math.random().toString(36).substring(2) + Date.now().toString(36),
                    productId: product._id,
                    quantity: 1,
                    customizations: {
                      extraPets: parseInt(petCount) || 0,
                      hasSpecialBackground: selectedOptions.includes('special-background'),
                      hasFrame: selectedOptions.includes('frame'),
                    },
                  };
                  addToCart(cartItem);
                  toast.success(`${product.name} agregado al carrito`);
                }}
                disabled={isLoadingPrice}
                className='w-full px-6 py-3 text-white transition-colors rounded-md bg-zinc-700 hover:bg-zinc-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {isLoadingPrice ? 'Calculando precio...' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const product = await client.fetch(productByIdQuery, {
    id: params?.id as string,
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const products = await client.fetch(allProductsQuery);

  return {
    paths: products.map((product: Product) => ({
      params: { id: product._id },
    })),
    fallback: 'blocking',
  };
};
