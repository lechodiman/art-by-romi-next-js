import { TypographyH1 } from '@/components/TypographyH1';
import { SharedPageProps } from '@/pages/_app';
import bruno from '@/public/images/bruno.jpg';
import domi from '@/public/images/domi.jpg';
import { client, getSiteSettings } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { SiteSettings } from '@/sanity/lib/queries';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps extends SharedPageProps {
  siteSettings: SiteSettings;
}

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const siteSettings = await getSiteSettings(client);

  return {
    props: {
      siteSettings,
    },
    revalidate: 3600,
  };
};

export default function Home(props: PageProps) {
  const { siteSettings } = props;

  return (
    <div>
      <div className='bg-zinc-100'>
        <div className='container px-5 py-20 mx-auto'>
          <div className='flex flex-col items-center space-y-5 text-center'>
            <TypographyH1>{siteSettings.title}</TypographyH1>

            <p className='tracking-widest uppercase'>{siteSettings.subtitle}</p>

            <Image
              className='object-contain w-80'
              src={urlForImage(siteSettings.heroImage)}
              width={320}
              height={500}
              alt='Retrato de gato'
              priority
            ></Image>

            <Link href='/contacto' className='inline-block tracking-widest uppercase'>
              QUIERO ENCARGAR UN RETRATO{' '}
              <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </Link>
          </div>
        </div>
      </div>

      <section className='py-14'>
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

            <Link href='/portafolio' className='inline-block tracking-widest uppercase'>
              Ver Portafolio <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

      <section className='py-14 bg-zinc-100'>
        <div className='container max-w-4xl px-5 mx-auto'>
          <div className='space-y-10 text-center'>
            <h2 className='font-serif text-4xl tracking-wide uppercase text-neutral-700'>
              Testimonios
            </h2>

            <div className='space-y-20'>
              <div className='flex flex-col items-center gap-4 md:gap-8 md:flex-row-reverse'>
                <p className='text-base leading-relaxed'>
                  &quot;Las obras que retratan a mis perritos lograron que sintiera que
                  volvieran a mi lado despues de que ya hubieran partido, se nota el
                  talento y la pasion en querer inmortalizar a nuestras mascotas y al
                  mismo tiempo la delicadeza de Romina en realizar de forma minuciosiosa
                  los mas prolijos detalles para entregar un trabajo no solo mas que
                  competente, sino tambien el amor con que hace estos cuadros&quot;
                </p>
                <div className='flex-shrink-0 space-y-2'>
                  <Image
                    src={bruno}
                    width={96}
                    className='object-cover w-24 h-24 rounded-full'
                    alt='Pintura de perro bruno'
                  ></Image>
                  <p className='font-serif tracking-widest text-center uppercase'>
                    Bruno
                  </p>
                </div>
              </div>

              <div className='flex flex-col items-center gap-4 md:gap-8 md:flex-row-reverse'>
                <p className='text-base leading-relaxed'>
                  &quot;Cuando recibí la pintura me impresionó lo real de ella, ya que
                  capturó detalles únicos de mi perrito, incluso su mirada y el brillo en
                  sus ojos, lo que me hizo notar la dedicación y cariño que hubo en el
                  proceso para retratar&quot;
                </p>
                <div className='flex-shrink-0 space-y-2'>
                  <Image
                    className='object-cover w-24 h-24 rounded-full'
                    src={domi}
                    width={96}
                    alt='Pintura de Domi'
                  ></Image>
                  <p className='font-serif tracking-widest text-center uppercase'>
                    Aaron
                  </p>
                </div>
              </div>
            </div>

            <Link href='/contacto' className='inline-block tracking-widest uppercase'>
              Ponte en contacto <ArrowLongRightIcon className='inline-block w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
