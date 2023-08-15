import { TypographyH1 } from '@/components/TypographyH1';
import Image from 'next/image';
import bruno from '@/public/images/bruno.jpg';
import chola from '@/public/images/chola.jpg';
import copito from '@/public/images/copito.jpg';
import domi from '@/public/images/domi.jpg';
import domi2 from '@/public/images/domi-2.jpg';
import lana from '@/public/images/lana.jpg';
import luna2 from '@/public/images/luna-2.jpg';
import locky2 from '@/public/images/locky-2.jpg';
import pajarraco from '@/public/images/pajarraco.jpg';
import pia2 from '@/public/images/pia-2.jpg';
import popom from '@/public/images/popom.jpg';
import ruffo from '@/public/images/ruffo.jpg';
import thor from '@/public/images/thor.jpg';
import tomi from '@/public/images/tomi.jpg';

const images = [
  { src: bruno, alt: 'Bruno' },
  { src: chola, alt: 'Chola' },
  { src: copito, alt: 'Copito' },
  { src: domi, alt: 'Domi' },
  { src: domi2, alt: 'Domi 2' },
  { src: lana, alt: 'Lana' },
  { src: luna2, alt: 'Luna 2' },
  { src: locky2, alt: 'Locky 2' },
  { src: pajarraco, alt: 'Pajarraco' },
  { src: pia2, alt: 'Pia 2' },
  { src: popom, alt: 'Popom' },
  { src: ruffo, alt: 'Ruffo' },
  { src: thor, alt: 'Thor' },
  { src: tomi, alt: 'Tomi' },
];

export default function Portafolio() {
  return (
    <div className='bg-gray-200'>
      <section className='container px-5 mx-auto space-y-8 text-center py-14'>
        <TypographyH1>Portafolio</TypographyH1>
        <div className='gap-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4'>
          {images.map((image) => (
            <div key={image.alt} className='mb-6'>
              <Image
                src={image.src}
                alt={image.alt}
                width={500}
                className='object-cover object-center transition duration-500 ease-in-out transform rounded-lg shadow-lg hover:-translate-y-1 hover:scale-105'
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
