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
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
