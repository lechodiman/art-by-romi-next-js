import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${playfair.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
