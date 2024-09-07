import Image from 'next/image';
import { CustomLink } from './CustomLink';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { urlForImage } from '@/sanity/lib/image';
import { Painting } from '@/sanity/lib/queries';

interface GalleryProps {
  featuredPaintings: Painting[];
}

export default function Gallery({ featuredPaintings }: GalleryProps) {
  return (
    <section className='bg-white py-14'>
      <div className='container max-w-6xl px-5 mx-auto'>
        <h2 className='mb-10 font-serif text-4xl tracking-wide text-center uppercase text-neutral-700'>
          Galería
        </h2>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          {featuredPaintings.map((painting) => (
            <div key={painting._id} className='aspect-square'>
              <Image
                src={urlForImage(painting.image)}
                alt={painting.name}
                width={300}
                height={300}
                className='object-cover w-full h-full rounded-lg'
              />
            </div>
          ))}
        </div>
        <div className='mt-10 text-center'>
          <CustomLink href='/portafolio'>
            Ver todo el portafolio <ArrowLongRightIcon className='inline-block w-5 h-5' />
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
