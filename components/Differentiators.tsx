import Image from 'next/image';
import { TypographyH1 } from './TypographyH1';
import { SiteSettings } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

interface DifferentiatorsProps {
  differentiators: SiteSettings['differentiators'];
}

export default function Differentiators({ differentiators }: DifferentiatorsProps) {
  return (
    <section className='py-14 bg-zinc-100'>
      <div className='container max-w-6xl px-5 mx-auto'>
        <h2 className='mb-10 font-serif text-4xl tracking-wide text-center uppercase text-neutral-700'>
          Lo que me diferencia
        </h2>
        <div className='space-y-12'>
          {differentiators.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-8 ${
                item.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              <div className='md:w-1/2'>
                <Image
                  src={urlForImage(item.image)}
                  width={400}
                  height={300}
                  alt={item.title}
                  className='w-full rounded-lg'
                />
              </div>
              <div className='space-y-4 md:w-1/2'>
                <TypographyH1 className='text-xl'>{item.title}</TypographyH1>
                <p className='text-neutral-600'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
