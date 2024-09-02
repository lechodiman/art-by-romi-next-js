import { TypographyH1 } from '@/components/TypographyH1';
import { Wallet } from '@mercadopago/sdk-react';

const PricingCard = ({
  title,
  description,
  price,
}: {
  title: string;
  description: string;
  price: string;
}) => (
  <div className='p-6 bg-white rounded-lg shadow-md'>
    <h2 className='mb-4 text-2xl font-bold'>{title}</h2>
    <p className='mb-4 text-gray-700'>{description}</p>
    <p className='text-xl font-semibold'>{price}</p>
  </div>
);

export default function Pricing() {
  return (
    <div className='bg-gray-200'>
      <section className='container px-5 mx-auto space-y-8 text-center py-14'>
        <TypographyH1>Precios</TypographyH1>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <PricingCard
            title='Pequeño'
            description='Ideal para retratos individuales.'
            price='$50'
          />
          <PricingCard
            title='Familiar'
            description='Perfecto para retratos familiares.'
            price='$100'
          />
          <PricingCard
            title='Adorable'
            description='Para retratos adorables y únicos.'
            price='$150'
          />
        </div>

        <div className='max-w-md mx-auto'>
          <Wallet
            initialization={{
              preferenceId: '301896957-5fbdba6b-27ce-4a27-b33c-b282b6c8436c',
            }}
          />
        </div>
      </section>
    </div>
  );
}
