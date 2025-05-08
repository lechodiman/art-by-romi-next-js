import { TypographyH1 } from '@/components/TypographyH1';
import { Product } from '@/types/Product';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getClient } from '@/sanity/lib/client';
import { allProductsQuery, productByIdQuery } from '@/sanity/lib/queries';

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  price: number;
  type?: 'checkbox' | 'select';
  options?: { value: string; label: string; price: number }[];
}

const customizationOptions: CustomizationOption[] = [
  {
    id: 'extra-pet',
    name: 'Agregar mascota(s)',
    description: 'Incluye mascota(s) adicional(es) en el retrato',
    price: 0, // El precio base ahora será 0 y se calculará según la selección
    type: 'select',
    options: [
      { value: '0', label: 'Sin mascota adicional', price: 0 },
      { value: '1', label: '1 mascota adicional (+$15.000)', price: 15000 },
      { value: '2', label: '2 mascotas adicionales (+$20.000)', price: 20000 },
    ],
  },
  {
    id: 'special-background',
    name: 'Fondo especial',
    description:
      'Añade un fondo personalizado al retrato (+$5.000), si no se selecciona esta opción, es por defecto un fondo de 1 color',
    price: 5000,
    type: 'checkbox',
  },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [petCount, setPetCount] = useState('0');

  const product: Product = {
    id: '1',
    name: 'Retrato al óleo tamaño Mini',
    description: 'Retrato personalizado al óleo sobre lienzo tamaño Mini de 20 cm x 25cm',
    price: 40000,
    images: ['/images/product1.jpg'],
    category: 'retratos',
  };

  const calculateTotalPrice = () => {
    const basePrice = product.price;
    const optionsPrice = selectedOptions.reduce((total, optionId) => {
      const option = customizationOptions.find((opt) => opt.id === optionId);
      if (!option) return total;

      if (option.id === 'extra-pet') {
        const petOption = option.options?.find((opt) => opt.value === petCount);
        return total + (petOption?.price || 0);
      }
      return total + option.price;
    }, 0);
    return basePrice + optionsPrice;
  };

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
            <div className='relative h-96'>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className='object-cover rounded-lg'
              />
            </div>
            <div className='space-y-6'>
              <TypographyH1>{product.name}</TypographyH1>
              <p className='text-gray-600'>{product.description}</p>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>Personalización</h3>
                {customizationOptions.map((option) => (
                  <div key={option.id} className='space-y-2'>
                    {option.type === 'select' ? (
                      <div>
                        <label className='block mb-2 font-medium text-gray-900'>
                          {option.name}
                        </label>
                        <select
                          value={petCount}
                          onChange={(e) => {
                            setPetCount(e.target.value);
                            if (e.target.value === '0') {
                              setSelectedOptions((prev) =>
                                prev.filter((id) => id !== option.id)
                              );
                            } else if (!selectedOptions.includes(option.id)) {
                              setSelectedOptions((prev) => [...prev, option.id]);
                            }
                          }}
                          className='w-full border-gray-300 rounded-md shadow-sm focus:border-zinc-500 focus:ring-zinc-500'
                        >
                          {option.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <label className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => toggleOption(option.id)}
                          className='w-4 h-4 rounded text-zinc-700 focus:ring-zinc-500'
                        />
                        <span className='font-medium text-gray-900'>{option.name}</span>
                      </label>
                    )}
                    {selectedOptions.includes(option.id) && (
                      <p className='pl-6 text-sm text-gray-600'>{option.description}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className='pt-4 border-t border-gray-200'>
                <p className='text-2xl font-bold text-gray-900'>
                  ${calculateTotalPrice().toLocaleString()}
                </p>
                {selectedOptions.length > 0 && (
                  <p className='text-sm text-gray-600'>
                    Precio base: ${product.price.toLocaleString()}
                  </p>
                )}
              </div>
              const {addToCart} = useCart();
              <button
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    quantity: 1,
                    options: selectedOptions,
                    petCount: petCount,
                  });
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const product = await client.fetch(productByIdQuery, {
    id: params?.id as string,
  });

  if (!product) {
    return {
      notFound: true, // Retornará una página 404 si el producto no existe
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 3600, // Revalidar cada hora
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const products = await client.fetch(allProductsQuery);

  return {
    paths: products.map((product: Product) => ({
      params: { id: product._id },
    })),
    fallback: 'blocking', // Muestra una página de carga mientras se genera el contenido
  };
};
