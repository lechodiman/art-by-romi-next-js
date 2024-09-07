import Image from 'next/image';
import { TypographyH1 } from './TypographyH1';

export default function Differentiators() {
  return (
    <section className='py-14 bg-zinc-100'>
      <div className='container max-w-6xl px-5 mx-auto'>
        <h2 className='mb-10 font-serif text-4xl tracking-wide text-center uppercase text-neutral-700'>
          Lo que me diferencia
        </h2>
        <div className='space-y-12'>
          <div className='flex flex-col items-center gap-8 md:flex-row'>
            <div className='md:w-1/2'>
              <Image
                src='/images/pet-portait.webp'
                width={400}
                height={300}
                alt='Retrato de mascota'
                className='w-full rounded-lg'
              />
            </div>
            <div className='space-y-4 md:w-1/2'>
              <TypographyH1 className='text-xl'>Personaliza tu retrato</TypographyH1>
              <p className='text-neutral-600'>
                Elige el tamaño del lienzo, el color y el estilo que más te guste.
              </p>
            </div>
          </div>
          <div className='flex flex-col items-center gap-8 md:flex-row-reverse'>
            <div className='md:w-1/2'>
              <Image
                src='/images/artist-drawing.webp'
                width={400}
                height={300}
                alt='Artista dibujando'
                className='w-full rounded-lg'
              />
            </div>
            <div className='space-y-4 md:w-1/2'>
              <TypographyH1 className='text-xl'>Arte personalizado y único</TypographyH1>
              <p className='text-neutral-600'>
                Voy a pintar tu retrato con amor y dedicación, capturando cada detalle
                único de tu mascota. Cada retrato es una obra de arte exclusiva y
                personalizada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
