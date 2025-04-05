import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Playfair_Display } from 'next/font/google';
import Head from 'next/head';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export interface SharedPageProps {}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${playfair.variable}`}>
      <Head>
        <title>Retratos Romi - Retratos Personalizados de Mascotas</title>
        <meta
          name='description'
          content='Retratos óleo personalizados de tus mascotas, con un estilo único y realista. Captura la esencia de tu amigo peludo en una obra de arte.'
        />
        <meta
          name='keywords'
          content='retratos de mascotas, arte personalizado, pintura al óleo, mascotas, arte, cuadro de mascotas, arte, mascotas, óleo, retrata a tu mascota, pinto a tu mascota.'
        />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta charSet='utf-8' />
        {/* Open Graph */}
        <meta property='og:site_name' content='Retratos Romi' />
        <meta property='og:locale' content='es_CL' />
        <meta
          property='og:title'
          content='Retratos Romi - Retratos Personalizados de Mascotas'
        />
        <meta
          property='og:description'
          content='Convierte a tu mascota en una obra de arte con Retratos Romi. Pinturas al óleo personalizadas, hechas con amor.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://www.retratosromi.com/' />
        <meta
          property='og:image'
          content='https://www.retratosromi.com/images/portada.jpg'
        />
        <meta property='og:image:alt' content='Retrato al óleo de mascota' />
        <meta property='og:image:type' content='image/jpeg' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
