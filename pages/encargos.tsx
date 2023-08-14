import { TypographyH1 } from '@/components/TypographyH1';
import Image from 'next/image';
import bruno from '@/public/images/bruno.jpg';
import domi from '@/public/images/domi.jpg';
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
          <div className='relative'>
            <Image src={tomi} alt='Pick a Size' className='object-contain h-80' />
          </div>
          <div className='flex flex-col'>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              1. Elige un tamaño
            </h2>
            <p className='text-lg text-neutral-500'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada, nunc
              vel bibendum bibendum, elit magna bibendum elit, vel bibendum bibendum elit
              magna bibendum elit.
            </p>
          </div>
        </section>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='flex flex-col '>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              2. Elige tus fotos
            </h2>
            <p className='text-lg text-neutral-500'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada, nunc
              vel bibendum bibendum, elit magna bibendum elit, vel bibendum bibendum elit
              magna bibendum elit.
            </p>
          </div>
          <div className='relative'>
            <Image src={bruno} alt='Choose your Photos' className='object-contain h-80' />
          </div>
        </section>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='relative'>
            <Image src={domi} alt='Get In touch' className='object-contain h-80' />
          </div>
          <div className='flex flex-col '>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              3. Ponte en contacto
            </h2>
            <p className='text-lg text-neutral-500'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada, nunc
              vel bibendum bibendum, elit magna bibendum elit, vel bibendum bibendum elit
              magna bibendum elit.
            </p>
          </div>
        </section>
        <section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-2'>
          <div className='flex flex-col '>
            <h2 className='mb-4 font-serif text-3xl uppercase text-neutral-700'>
              4. Mira tu retrato cobrar vida
            </h2>
            <p className='text-lg text-neutral-500'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada, nunc
              vel bibendum bibendum, elit magna bibendum elit, vel bibendum bibendum elit
              magna bibendum elit.
            </p>
          </div>
          <div className='relative'>
            <Image
              src={bruno}
              alt='Watch your portrait come to life'
              className='object-contain h-80'
            />
          </div>
        </section>
      </section>
    </div>
  );
}
