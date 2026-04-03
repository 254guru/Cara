import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Cart from '@/components/layout/Cart';
import DeferredAIAssistant from '@/components/ai/DeferredAIAssistant';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cara-stores.example'),
  title: {
    default: 'Cara Stores | Mobile-first Style Commerce',
    template: '%s | Cara Stores',
  },
  description: 'Cara Stores Kenya is a Nairobi-based, mobile-first fashion storefront with curated drops and mobile money checkout.',
  keywords: ['fashion', 'mobile commerce', 'Nairobi', 'Kenya', 'M-Pesa', 'Airtel Money', 'streetwear', 'online boutique'],
  authors: [{ name: 'Cara Stores Team' }],
  openGraph: {
    title: 'Cara Stores | Mobile-first Style Commerce',
    description: 'Curated apparel from Nairobi with fast mobile checkout via M-Pesa and Airtel Money.',
    type: 'website',
    url: 'https://cara-stores.example',
    siteName: 'Cara Stores',
    images: [{ url: '/banner-img/b1.webp', width: 1200, height: 630, alt: 'Cara Stores shopping collection' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cara Stores | Mobile-first Style Commerce',
    description: 'Curated apparel from Nairobi with fast mobile checkout via M-Pesa and Airtel Money.',
    images: ['/banner-img/b1.webp'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="shortcut icon" href="/extra-img/giphy.webp" type="image/x-icon" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Cart />
            <DeferredAIAssistant />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
