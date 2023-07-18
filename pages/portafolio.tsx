import { TypographyH1 } from '@/components/TypographyH1';
import Image from 'next/image';

export default function Portafolio() {
  const images = [
    { src: '/images/bruno.jpg', alt: 'Image 1' },
    { src: '/images/copito.jpg', alt: 'Image 2' },
    { src: '/images/domi.jpg', alt: 'Image 3' },
    { src: '/images/lana.jpg', alt: 'Image 4' },
    { src: '/images/locky.jpg', alt: 'Image 5' },
    { src: '/images/luna.jpg', alt: 'Image 6' },
    { src: '/images/lunita.jpg', alt: 'Image 6' },
    { src: '/images/pajarraco.jpg', alt: 'Image 6' },
    { src: '/images/pia.jpg', alt: 'Image 6' },
    { src: '/images/ruffo.jpg', alt: 'Image 6' },
    { src: '/images/thor.jpg', alt: 'Image 6' },
    { src: '/images/tomi.jpg', alt: 'Image 6' },
  ];

  return (
    <div className='bg-gray-200'>
      <section className='container px-5 mx-auto space-y-8 text-center py-14'>
        <TypographyH1>Portafolio</TypographyH1>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {images.map((image) => (
            <div key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                width={500}
                height={500}
                layout='responsive'
                className='rounded-lg'
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
