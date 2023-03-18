import { Transition, Dialog, Popover, Menu } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import tomi from '../public/images/tomi.jpg';

const navigation = {
  pages: [
    { name: 'Inicio', href: '/' },
    { name: 'Testimonios', href: '/testimonios' },
    { name: 'Galería', href: '/portafolio' },
    { name: '¿Cómo hago un encargo?', href: '/instrucciones' },
    { name: 'Contáctame', href: '/contáctame' },
  ],
};

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className='bg-white text-zinc-500'>
      <div className='min-h-screen pt-6 bg-zinc-100'>
        <div className='w-11/12 max-w-2xl mx-auto'>
          <Menu>
            <header className=''>
              <div className='flex items-center justify-between'>
                <div className='inline-block'>LOGO</div>
                <Menu.Button>
                  <Bars3Icon className='w-7 h-7' />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter='transition ease-out duration-200 transform'
                enterFrom='-translate-y-6'
                enterTo='translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='translate-y-0'
                leaveTo='-translate-y-6'
              >
                <Menu.Items className='flex flex-col mt-4 space-y-3'>
                  {navigation.pages.map((page) => (
                    <Menu.Item key={page.name}>
                      <Link href={page.href}>{page.name}</Link>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </header>
          </Menu>

          <div className='flex flex-col items-center space-y-5 text-center mt-14'>
            <h2 className='font-serif text-5xl font-light tracking-wide uppercase text-neutral-700'>
              Pintando Mascotas
            </h2>

            <p className='tracking-widest uppercase '>Retratos de mascotas</p>

            <Image className='w-80' src={tomi} alt='Retrato de gato'></Image>

            <p className='tracking-widest uppercase'>Ver lista de precios</p>
          </div>
        </div>
      </div>
    </div>
  );
}
