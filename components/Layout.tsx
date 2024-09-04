import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

const navigation = {
  pages: [
    { name: 'Inicio', href: '/' },
    { name: 'Galería', href: '/portafolio' },
    { name: 'Contáctame', href: '/contacto' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen bg-white text-zinc-500'>
      <header className='px-5 py-5 bg-zinc-100'>
        <div className='container mx-auto'>
          <div className='hidden md:flex md:items-center md:justify-between'>
            <div className='inline-block'>LOGO</div>
            <nav className='flex space-x-6'>
              {navigation.pages.map((page) => (
                <Link
                  className='text-zinc-500 hover:text-zinc-700'
                  key={page.name}
                  href={page.href}
                >
                  {page.name}
                </Link>
              ))}
            </nav>
          </div>
          <Menu>
            <header className='md:hidden'>
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
                leaveTo='-trandivte-y-6 opacity-0'
              >
                <Menu.Items className='flex flex-col mt-4 space-y-3'>
                  {navigation.pages.map((page) => (
                    <Menu.Item key={page.name}>
                      <Link
                        className='text-zinc-500 hover:text-zinc-700'
                        href={page.href}
                      >
                        {page.name}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </header>
          </Menu>
        </div>
      </header>

      {children}

      <footer className='container px-5 py-8 mx-auto text-center'>
        <p className='text-sm'>© 2024 Retratos Romi</p>
      </footer>
    </div>
  );
}
