import { TypographyH1 } from '@/components/TypographyH1';
import Image from 'next/image';
import bruno from '@/public/images/bruno.jpg';
import domi from '@/public/images/domi.jpg';
import domi2 from '@/public/images/domi-2.jpg';
import tomi from '@/public/images/tomi.jpg';

export default function Encargos() {
  return (
    <div className='bg-gray-200'>
      <section className='container mx-auto space-y-5 py-14'>
        <div className='text-center'>
          <TypographyH1>Guía de encargos</TypographyH1>
          <h3 className='tracking-widest uppercase'>paso a paso</h3>
        </div>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='flex justify-center'>
            <Image
              src={tomi}
              alt='Pick a Size'
              height={320}
              className='object-contain rounded-lg h-80'
            />
          </div>
          <div className='flex flex-col'>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              1. Elige un tamaño
            </h2>
            <p className='text-lg text-neutral-500'>
              Piensa en dónde vas a colocar tu retrato y elige un tamaño que se adapte a
              eso. Por ejemplo, si lo vas a tener en tu escritorio, en la pared del
              living, entre otros. También ten encuenta el tamaño de tu mascota, un perro
              grande se verá mejor en un tamaño grande.
            </p>
          </div>
        </section>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='flex flex-col '>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              2. Elige tus fotos
            </h2>
            <p className='text-lg text-neutral-500'>
              Mientras más fotos, mejor. Intenta que las fotos sean de buena calidad y que
              se vea bien la cara de tu mascota. Si tienes alguna foto favorita, puedes
              enviármela.
            </p>
          </div>
          <div className='flex justify-center'>
            <Image
              src={bruno}
              alt='Pick a Size'
              height={320}
              className='object-contain rounded-lg h-80'
            />
          </div>
        </section>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='flex justify-center'>
            <Image
              src={domi}
              alt='Pick a Size'
              height={320}
              className='object-contain rounded-lg h-80'
            />
          </div>
          <div className='flex flex-col '>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              3. Ponte en contacto
            </h2>
            <p className='text-lg text-neutral-500'>
              Envíame un mensaje a través de mi{' '}
              <a
                href='https://www.instagram.com/domi.draws/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:text-blue-600'
              >
                Instagram.
              </a>
            </p>
          </div>
        </section>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='flex flex-col '>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              4. Mira tu retrato cobrar vida
            </h2>
            <p className='text-lg text-neutral-500'>
              Una vez que hayamos acordado el tamaño y el precio, te enviaré un boceto
              para que lo apruebes. Luego, te enviaré una foto del retrato terminado para
              que lo apruebes. Si estás satisfecho, te enviaré el retrato físico a tu
              domicilio.
            </p>
          </div>
          <div className='flex justify-center'>
            <Image
              src={domi2}
              alt='Pick a Size'
              height={320}
              className='object-contain rounded-lg h-80'
            />
          </div>
        </section>
      </section>
    </div>
  );
}
