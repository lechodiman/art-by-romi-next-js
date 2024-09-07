import Image from 'next/image';
import { CustomLink } from './CustomLink';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { SiteSettings } from '@/sanity/lib/queries';

interface AboutMeProps {
  aboutMe: SiteSettings['aboutMe'];
}

export default function AboutMe({ aboutMe }: AboutMeProps) {
  return (
    <section className='bg-white py-14'>
      <div className='container max-w-6xl px-5 mx-auto'>
        <div className='flex flex-col items-center space-y-10 text-center'>
          <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
            Acerca de mi
          </h2>
          <div className='flex flex-col items-center gap-8 md:flex-row'>
            <div className='md:w-1/2'>
              <Image
                src={urlForImage(aboutMe.image)}
                width={400}
                height={400}
                alt='Acerca de mi'
                className='w-full rounded-lg'
              />
            </div>
            <div className='space-y-4 md:w-1/2'>
              <PortableText value={aboutMe.text} />
              <div className='mt-6'>
                <CustomLink href='/portafolio'>
                  Ver Portafolio <ArrowLongRightIcon className='inline-block w-5 h-5' />
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
