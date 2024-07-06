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
    revalidate: 60,
  };
};

export default function Portafolio(props: PageProps) {
  const { paintings } = props;

  return (
    <div className='bg-gray-200'>
      <section className='container px-5 mx-auto space-y-8 text-center py-14'>
        <TypographyH1>Portafolio</TypographyH1>
        <div className='gap-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4'>
          {paintings.map((paiting) => (
            <div key={paiting._id} className='mb-6'>
              <Image
                src={urlForImage(paiting.image)}
                alt={paiting.name}
                width={500}
                height={500}
                className='object-cover object-center transition duration-500 ease-in-out transform rounded-lg shadow-lg hover:-translate-y-1 hover:scale-105'
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
