import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

const navigation = {
  pages: [
    { name: 'Inicio', href: '/' },
    { name: 'Testimonios', href: '/testimonios' },
    { name: 'Galería', href: '/portafolio' },
    { name: '¿Cómo hago un encargo?', href: '/encargos' },
    { name: 'Contáctame', href: '/contáctame' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-white text-zinc-500'>
      <div className='bg-zinc-100'>
        <div className='container px-5 py-5 mx-auto'>
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
                enterFrom='-translate-y-6 opacity-0'
                enterTo='translate-y-0 opacity-100'
                leave='transition ease-in duration-150'
                leaveFrom='translate-y-0 opacity-100'
                leaveTo='-translate-y-6 opacity-0'
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
        </div>
      </div>

      {children}
    </div>
  );
}
