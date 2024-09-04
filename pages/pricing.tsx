import { useState } from 'react';
import { ComissionForm } from '@/components/comission-form';
import { TypographyH1 } from '@/components/TypographyH1';
import { Wallet } from '@mercadopago/sdk-react';
import Image from 'next/image';

const PricingCard = ({
  title,
  description,
  price,
  isPopular = false,
  buttonText = 'Comprar',
  onButtonClick,
}: {
  title: string;
  description: string;
  price: string;
  isPopular?: boolean;
  buttonText?: string;
  onButtonClick: () => void;
}) => (
  <div
    className={`p-6 rounded-lg shadow-md ${isPopular ? 'bg-blue-600 text-white' : 'bg-white'}`}
  >
    <div className='relative w-full h-40 mb-4'>
      <Image
        src='/placeholder-image.jpg'
        alt={`${title} canvas`}
        layout='fill'
        objectFit='cover'
        className='rounded-md'
      />
    </div>
    <h2 className='mb-2 text-2xl font-bold'>{title}</h2>
    <p className='mb-4 text-sm'>{description}</p>
    {isPopular && (
      <span className='px-2 py-1 mb-4 text-xs font-semibold text-blue-600 bg-white rounded-full'>
        Mejor Vendido
      </span>
    )}
    <p className='mb-4 text-3xl font-semibold'>{price}</p>
    <button
      className={`w-full py-2 rounded-md ${isPopular ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}
      onClick={onButtonClick}
    >
      {buttonText}
    </button>
  </div>
);

export default function Pricing() {
  const [isComissionFormOpen, setIsComissionFormOpen] = useState(false);

  const handleOpenComissionForm = () => {
    setIsComissionFormOpen(true);
  };

  const handleCloseComissionForm = () => {
    setIsComissionFormOpen(false);
  };

  return (
    <div className='flex-grow bg-gray-100'>
      <section className='container px-5 mx-auto space-y-8 text-center py-14'>
        <TypographyH1>Precios</TypographyH1>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <PricingCard
            title='Lienzo 20x25'
            description='Perfecto para espacios pequeños'
            price='35.000 CLP'
            onButtonClick={handleOpenComissionForm}
          />
          <PricingCard
            title='Lienzo 25x30'
            description='Nuestro tamaño más popular'
            price='40.000 CLP'
            isPopular={true}
            onButtonClick={handleOpenComissionForm}
          />
          <PricingCard
            title='Lienzo 30x40'
            description='Para espacios grandes'
            price='45.000 CLP'
            onButtonClick={handleOpenComissionForm}
          />
          <PricingCard
            title='Lienzo Personalizado'
            description='Crea tu propio diseño único'
            price='Precio a consultar'
            buttonText='Solicitar Personalizado'
            onButtonClick={handleOpenComissionForm}
          />
        </div>

        <div className='max-w-md mx-auto'>
          <Wallet
            initialization={{
              preferenceId: '1931267094-5c6abc91-bd78-40a7-96c3-4ded683a6979',
            }}
          />
        </div>

        <ComissionForm isOpen={isComissionFormOpen} onClose={handleCloseComissionForm} />
      </section>
    </div>
  );
}
