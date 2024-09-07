import Image from 'next/image';
import { CustomLink } from './CustomLink';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { urlForImage } from '@/sanity/lib/image';
import { SiteSettings } from '@/sanity/lib/queries';

interface TestimonialsProps {
  testimonials: SiteSettings['testimonials'];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className='bg-white py-14'>
      <div className='container max-w-6xl px-5 mx-auto'>
        <div className='space-y-10 text-center'>
          <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
            Testimonios
          </h2>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className='flex flex-col items-center space-y-4'>
                <Image
                  src={urlForImage(testimonial.image)}
                  width={96}
                  height={96}
                  className='object-cover w-24 h-24 rounded-full'
                  alt={`Retrato de ${testimonial.name}`}
                />
                <p className='font-serif tracking-widest text-center uppercase'>
                  {testimonial.name}
                </p>
                <p className='text-sm leading-relaxed'>&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>

          <CustomLink variant='primary' href='/contacto'>
            Ponte en contacto <ArrowLongRightIcon className='inline-block w-5 h-5' />
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
