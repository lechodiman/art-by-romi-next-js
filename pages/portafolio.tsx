import { TypographyH1 } from '@/components/TypographyH1';
import Image from 'next/image';
import bruno from '@/public/images/bruno.jpg';
import copito from '@/public/images/copito.jpg';
import domi from '@/public/images/domi.jpg';
import lana from '@/public/images/lana.jpg';
import locky from '@/public/images/locky.jpg';
import luna from '@/public/images/luna.jpg';
import lunita from '@/public/images/lunita.jpg';
import pajarraco from '@/public/images/pajarraco.jpg';
import pia from '@/public/images/pia.jpg';
import ruffo from '@/public/images/ruffo.jpg';
import thor from '@/public/images/thor.jpg';
import tomi from '@/public/images/tomi.jpg';

export default function Portafolio() {
  const images = [
    { src: bruno, alt: 'Image 1' },
    { src: copito, alt: 'Image 2' },
    { src: domi, alt: 'Image 3' },
    { src: lana, alt: 'Image 4' },
    { src: locky, alt: 'Image 5' },
    { src: luna, alt: 'Image 6' },
    { src: lunita, alt: 'Image 7' },
    { src: pajarraco, alt: 'Image 8' },
    { src: pia, alt: 'Image 9' },
    { src: ruffo, alt: 'Image 10' },
    { src: thor, alt: 'Image 11' },
    { src: tomi, alt: 'Image 12' },
  ];

  return (
    <div className='bg-gray-200'>
      <section className='container px-5 mx-auto space-y-8 text-center py-14'>
        <TypographyH1>Portafolio</TypographyH1>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {images.map((image) => (
            <div key={image.alt} className='relative'>
              <Image
                src={image.src}
                alt={image.alt}
                className='object-cover object-center transition duration-500 ease-in-out transform rounded-lg shadow-lg hover:-translate-y-1 hover:scale-105'
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
