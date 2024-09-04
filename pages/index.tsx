import { CustomLink } from '@/components/CustomLink';
import { TypographyH1 } from '@/components/TypographyH1';
import { SharedPageProps } from '@/pages/_app';
import { client, getSiteSettings } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { Painting, SiteSettings, featuredPaintingsQuery } from '@/sanity/lib/queries';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { GetStaticProps } from 'next';
import Image from 'next/image';

interface PageProps extends SharedPageProps {
  siteSettings: SiteSettings;
  featuredPaintings: Painting[];
}

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const siteSettings = await getSiteSettings(client);
  const featuredPaintings = await client.fetch(featuredPaintingsQuery);

  return {
    props: {
      siteSettings,
      featuredPaintings,
    },
    revalidate: 3600,
  };
};

export default function Home(props: PageProps) {
  const { siteSettings, featuredPaintings } = props;

  return (
    <div>
      <div className='bg-zinc-100'>
        <div className='container max-w-6xl px-5 py-20 mx-auto'>
          <div className='flex flex-col md:flex-row'>
            {/* Left column: Image */}
            <div className='order-2 w-full mb-10 md:w-1/3 md:mb-0 md:order-1'>
              <Image
                className='object-contain w-full max-w-md mx-auto'
                src={urlForImage(siteSettings.heroImage)}
                width={500}
                height={700}
                alt='Retrato de gato'
                priority
              />
            </div>

            {/* Right column: Logo, Title, Subtitle, CTA */}
            <div className='flex flex-col items-center order-1 w-full mb-10 text-center md:w-2/3 md:order-2 md:mb-0 md:pl-8'>
              <Image
                src='/logo.svg'
                width={150}
                height={150}
                alt='Logo'
                className='mb-6'
              />

              <TypographyH1>{siteSettings.title}</TypographyH1>

              <p className='mt-2 tracking-widest uppercase'>{siteSettings.subtitle}</p>

              <div className='mt-12'>
                <CustomLink href='/contacto' variant='primary' popup>
                  QUIERO ENCARGAR UN RETRATO
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className='bg-white py-14'>
        <div className='container max-w-6xl px-5 mx-auto'>
          <h2 className='mb-10 font-serif text-4xl tracking-wide text-center uppercase text-neutral-700'>
            Galería
          </h2>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
            {featuredPaintings.map((painting) => (
              <div key={painting._id} className='aspect-square'>
                <Image
                  src={urlForImage(painting.image)}
                  alt={painting.name}
                  width={300}
                  height={300}
                  className='object-cover w-full h-full rounded-lg'
                />
              </div>
            ))}
          </div>
          <div className='mt-10 text-center'>
            <CustomLink href='/portafolio'>
              Ver todo el portafolio{' '}
              <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </CustomLink>
          </div>
        </div>
      </section>

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
                <TypographyH1 className='text-xl'>
                  Arte personalizado y único
                </TypographyH1>
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

      <section className='bg-white py-14'>
        <div className='container max-w-6xl px-5 mx-auto'>
          <div className='space-y-10 text-center'>
            <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
              Testimonios
            </h2>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {siteSettings.testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className='flex flex-col items-center space-y-4'
                >
                  <Image
                    src={urlForImage(testimonial.image)}
                    width={96}
                    height={96}
                    className='object-cover w-24 h-24 rounded-full'
                    alt={`Retrato de ${testimonial.name}`}
                  />
                  <p className='font-serif tracking-widest text-center uppercase'>
                    {testimonial.name}
                  </p>
                  <p className='text-sm leading-relaxed'>
                    &quot;{testimonial.text}&quot;
                  </p>
                </div>
              ))}
            </div>

            <CustomLink href='/contacto'>
              Ponte en contacto <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </CustomLink>
          </div>
        </div>
      </section>

      <section className='py-14 bg-zinc-100'>
        <div className='container max-w-4xl px-5 mx-auto'>
          <div className='space-y-10 text-center'>
            <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
              Preguntas Frecuentes
            </h2>

            <div className='space-y-4'>
              {siteSettings.faqItems.map((item, index) => (
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
      <section className='bg-white py-14'>
        <div className='container max-w-4xl px-5 mx-auto'>
          <div className='flex flex-col items-center space-y-10 text-center'>
            <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
              Acerca de mi
            </h2>

            {siteSettings.aboutMe.map((block, index) => (
              <p key={index} className='text-base leading-relaxed'>
                {block.children.map((child, index) => (
                  <span key={index}>{child.text}</span>
                ))}
              </p>
            ))}

            <CustomLink href='/portafolio'>
              Ver Portafolio <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </CustomLink>
          </div>
        </div>
      </section>
    </div>
  );
}
