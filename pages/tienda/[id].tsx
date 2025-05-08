import { TypographyH1 } from '@/components/TypographyH1';
import { Product } from '@/types/Product';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

const customizationOptions: CustomizationOption[] = [
  {
    id: 'extra-pet',
    name: 'Agregar mascota',
    description: 'Incluye una mascota adicional en el retrato (+$15.000)',
    price: 15000,
  },
  {
    id: 'special-background',
    name: 'Fondo especial',
    description: 'Añade un fondo personalizado al retrato (+$10.000)',
    price: 10000,
  },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const product: Product = {
    id: '1',
    name: 'Retrato a Lápiz',
    description: 'Retrato personalizado en lápiz grafito sobre papel',
    price: 25000,
    images: ['/images/product1.jpg'],
    category: 'retratos',
  };

  const calculateTotalPrice = () => {
    const basePrice = product.price;
    const optionsPrice = selectedOptions.reduce((total, optionId) => {
      const option = customizationOptions.find((opt) => opt.id === optionId);
      return total + (option?.price || 0);
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
                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => toggleOption(option.id)}
                        className='w-4 h-4 rounded text-zinc-700 focus:ring-zinc-500'
                      />
                      <span className='font-medium text-gray-900'>{option.name}</span>
                    </label>
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
