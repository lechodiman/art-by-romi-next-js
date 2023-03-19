import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import bruno from '../public/images/bruno.jpg';
import domi from '../public/images/domi.jpg';
import tomi from '../public/images/tomi.jpg';

export default function Home() {
  return (
    <div>
      <div className='min-h-screen bg-zinc-100'>
        <div className='container px-5 py-10 mx-auto'>
          <div className='flex flex-col items-center space-y-5 text-center'>
            <h2 className='font-serif text-5xl tracking-wide uppercase text-neutral-700'>
              Pintando Mascotas
            </h2>

            <p className='tracking-widest uppercase'>Retratos de mascotas en acrílico</p>

            <Image
              className='object-contain w-80'
              src={tomi}
              width={320}
              alt='Retrato de gato'
              priority
            ></Image>

            <Link href='#' className='inline-block tracking-widest uppercase'>
              Ver lista de precios <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </Link>
          </div>
        </div>
      </div>

      <section className='py-14'>
        <div className='container px-5 mx-auto'>
          <div className='flex flex-col items-center space-y-5 text-center'>
            <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
              Acerca de mi
            </h2>
            <p className='text-sm'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At, temporibus
              repudiandae perferendis et explicabo, necessitatibus officiis odit esse vero
              eos excepturi quam incidunt rerum eum accusantium voluptatem quae laudantium
              hic!
            </p>
            <p className='text-sm'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At, temporibus
              repudiandae perferendis et explicabo, necessitatibus officiis odit esse vero
              eos excepturi quam incidunt rerum eum accusantium voluptatem quae laudantium
              hic!
            </p>
            <p className='text-sm'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At, temporibus
              repudiandae perferendis et explicabo, necessitatibus officiis odit esse vero
              eos excepturi quam incidunt rerum eum accusantium voluptatem quae laudantium
              hic!
            </p>

            <Link href='#' className='inline-block tracking-widest uppercase'>
              Ver Portafolio <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

      <section className='py-14 bg-zinc-100'>
        <div className='container px-5 mx-auto'>
          <div className='space-y-10 text-center'>
            <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
              Testimonios
            </h2>

            <div className='space-y-8'>
              <div className='flex flex-col items-center space-y-4'>
                <p className='text-sm'>
                  &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit. At,
                  temporibus repudiandae perferendis et explicabo, necessitatibus officiis
                  odit esse vero&quot;
                </p>
                <Image
                  className='object-cover w-24 h-24 rounded-full'
                  src={bruno}
                  width={96}
                  height={96}
                  alt='Pintura de perro bruno'
                ></Image>
                <p className='font-serif tracking-widest text-center uppercase'>Bruno</p>
              </div>

              <div className='flex flex-col items-center space-y-4'>
                <p className='text-sm'>
                  &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit. At,
                  temporibus repudiandae perferendis et explicabo, necessitatibus officiis
                  odit esse vero&quot;
                </p>
                <Image
                  className='object-cover w-24 h-24 rounded-full'
                  src={domi}
                  width={96}
                  height={96}
                  alt='Pintura de Domi'
                ></Image>
                <p className='font-serif tracking-widest text-center uppercase'>Domi</p>
              </div>

              <div className='flex flex-col items-center space-y-4'>
                <p className='text-sm'>
                  &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit. At,
                  temporibus repudiandae perferendis et explicabo, necessitatibus officiis
                  odit esse vero&quot;
                </p>
                <Image
                  className='object-cover w-24 h-24 rounded-full'
                  src={bruno}
                  width={96}
                  height={96}
                  alt='Pintura de perro bruno'
                ></Image>
                <p className='font-serif tracking-widest text-center uppercase'>Bruno</p>
              </div>
            </div>

            <Link href='#' className='inline-block tracking-widest uppercase'>
              Ponte en contacto <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

      <footer className='container px-5 py-8 mx-auto text-center'>
        <p className='text-sm'>
          © 2023 Pintando Mascotas | Hecho con{' '}
          <span className='text-red-500'>&#10084;&#65039;</span> por Luis Chodiman{' '}
        </p>
      </footer>
    </div>
  );
}
