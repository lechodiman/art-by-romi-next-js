import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { InstagramIcon, TiktokIcon } from './SocialIcons';
import Link from 'next/link';
import Image from 'next/image';
import { Fragment } from 'react';

const navigation = {
  pages: [
    { name: 'Inicio', href: '/' },
    { name: 'Galería', href: '/portafolio' },
    { name: 'Contáctame', href: '/contacto' },
    { name: 'Mi carrito', href: '/carrito', icon: ShoppingCartIcon },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen bg-white text-zinc-500'>
      <header className='px-5 py-5 bg-zinc-100'>
        <div className='container mx-auto'>
          <div className='hidden md:flex md:items-center md:justify-between'>
            <Link href='/' className='inline-block'>
              <Image src='/logo.svg' alt='Retratos Romi Logo' width={100} height={100} />
            </Link>
            <nav className='flex space-x-6'>
              {navigation.pages.map((page) => (
                <Link
                  className='flex items-center space-x-1 text-zinc-500 hover:text-zinc-700'
                  key={page.name}
                  href={page.href}
                >
                  {page.icon && <page.icon className='w-5 h-5' />}
                  <span>{page.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <Menu>
            <header className='md:hidden'>
              <div className='flex items-center justify-between'>
                <Link href='/' className='inline-block'>
                  <Image
                    src='/logo.svg'
                    alt='Retratos Romi Logo'
                    width={80}
                    height={80}
                  />
                </Link>
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
                        className='flex items-center space-x-1 text-zinc-500 hover:text-zinc-700'
                        href={page.href}
                      >
                        {page.icon && <page.icon className='w-5 h-5' />}
                        <span>{page.name}</span>
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

      <footer className='mt-auto bg-zinc-100'>
        <div className='container px-5 py-8 mx-auto'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <div className='flex space-x-6'>
              <a
                href='https://www.instagram.com/retratosromi/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-500 hover:text-zinc-700'
              >
                <span className='sr-only'>Instagram</span>
                <InstagramIcon className='w-6 h-6' />
              </a>
              <a
                href='https://www.tiktok.com/@retratosromi'
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-500 hover:text-zinc-700'
              >
                <span className='sr-only'>TikTok</span>
                <TiktokIcon className='w-6 h-6' />
              </a>
            </div>
            <p className='text-sm'>© 2025 Retratos Romi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
