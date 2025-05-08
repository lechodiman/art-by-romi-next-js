import { TypographyH1 } from '@/components/TypographyH1';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/Product';
import { GetStaticProps } from 'next';
import { getClient } from '@/sanity/lib/client';
import { allProductsQuery } from '@/sanity/lib/queries';

interface PageProps {
  products: Product[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const client = getClient();
  const products = await client.fetch(allProductsQuery);

  return {
    props: {
      products,
    },
    revalidate: 3600,
  };
};

export default function Tienda({ products }: PageProps) {
  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container px-5 mx-auto py-14'>
        <TypographyH1 className='mb-10 text-center'>Tienda</TypographyH1>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
