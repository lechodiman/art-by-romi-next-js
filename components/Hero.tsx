import Image from 'next/image';
import { CustomLink } from './CustomLink';
import { TypographyH1 } from './TypographyH1';
import { urlForImage } from '@/sanity/lib/image';
import { SiteSettings } from '@/sanity/lib/queries';

interface HeroProps {
  siteSettings: SiteSettings;
}

export default function Hero({ siteSettings }: HeroProps) {
  return (
    <div className='bg-zinc-100'>
      <div className='container max-w-6xl px-5 py-20 mx-auto'>
        <div className='flex flex-col md:flex-row'>
          {/* Left column: Image */}
          <div className='order-2 w-full mb-10 md:w-1/3 md:mb-0 md:order-1'>
            <Image
              className='object-contain w-full max-w-md mx-auto'
              src={urlForImage(siteSettings.heroImage)}
              width={500}
              height={700}
              alt='Retrato de gato'
              priority
            />
          </div>

          {/* Right column: Logo, Title, Subtitle, CTA */}
          <div className='flex flex-col items-center order-1 w-full mb-10 text-center md:w-2/3 md:order-2 md:mb-0 md:pl-8'>
            <Image src='/logo.svg' width={150} height={150} alt='Logo' className='mb-6' />

            <TypographyH1>{siteSettings.title}</TypographyH1>

            <p className='mt-2 tracking-widest uppercase'>{siteSettings.subtitle}</p>

            <div className='mt-12'>
              <CustomLink href='/contacto' variant='primary' popup>
                QUIERO ENCARGAR UN RETRATO
              </CustomLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
