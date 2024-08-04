import Layout from '@/components/Layout';
import '@/styles/globals.css';
import { initMercadoPago } from '@mercadopago/sdk-react';
import type { AppProps } from 'next/app';
import { Playfair_Display } from 'next/font/google';
import Head from 'next/head';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export interface SharedPageProps {}

initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID!);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${playfair.variable}`}>
      <Head>
        <title>Retratos Romi</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
