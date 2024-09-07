import { CustomLink } from './CustomLink';
import { ArrowLongRightIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { SiteSettings } from '@/sanity/lib/queries';
import { Disclosure, Transition } from '@headlessui/react';

interface FAQProps {
  faqItems: SiteSettings['faqItems'];
}

export default function FAQ({ faqItems }: FAQProps) {
  return (
    <section className='py-14 bg-zinc-100'>
      <div className='container max-w-6xl px-5 mx-auto'>
        <div className='space-y-10 text-center'>
          <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
            Preguntas Frecuentes
          </h2>

          <div className='space-y-4'>
            {faqItems.map((item, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-left rounded-lg text-neutral-900 bg-neutral-100 hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75'>
                      <span>{item.question}</span>
                      <ChevronUpIcon
                        className={`${
                          open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-neutral-500`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter='transition duration-100 ease-out'
                      enterFrom='transform scale-95 opacity-0'
                      enterTo='transform scale-100 opacity-100'
                      leave='transition duration-75 ease-out'
                      leaveFrom='transform scale-100 opacity-100'
                      leaveTo='transform scale-95 opacity-0'
                    >
                      <Disclosure.Panel className='px-4 pt-4 pb-2 text-neutral-700'>
                        {item.answer}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </div>

          <CustomLink href='/contacto'>
            ¿Tienes más preguntas? Contáctame{' '}
            <ArrowLongRightIcon className='inline-block w-5 h-5' />
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
