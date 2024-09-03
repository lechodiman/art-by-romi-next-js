import { TypographyH1 } from '@/components/TypographyH1';
import { SharedPageProps } from '@/pages/_app';
import { client, getPaintings } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { Painting } from '@/sanity/lib/queries';
import { GetStaticProps } from 'next';
import Image from 'next/image';

interface PageProps extends SharedPageProps {
  paintings: Painting[];
}

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const paintings = await getPaintings(client);

  return {
    props: {
      paintings,
    },
    revalidate: 3600,
  };
};

export default function Portafolio(props: PageProps) {
  const { paintings } = props;

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <TypographyH1 className='text-center'>Galería</TypographyH1>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {paintings.map((painting) => (
            <div key={painting._id} className='flex flex-col items-center'>
              <div className='relative w-full pt-[100%] overflow-hidden rounded-lg shadow-lg'>
                <Image
                  src={urlForImage(painting.image)}
                  alt={painting.name}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <h3 className='mt-4 font-serif text-xl text-gray-800'>{painting.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
