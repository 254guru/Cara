import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Cart from '@/components/layout/Cart';
import Loader from '@/components/ui/Loader';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cara-store.example'),
  title: {
    default: 'Cara Studio | Mobile-first Style Commerce',
    template: '%s | Cara Studio',
  },
  description: 'Cara Studio is a modern, mobile-first fashion storefront with curated drops, fast checkout, and editorial storytelling.',
  keywords: ['fashion', 'mobile commerce', 'streetwear', 'online boutique', 'shop'],
  authors: [{ name: 'Cara Studio Team' }],
  openGraph: {
    title: 'Cara Studio | Mobile-first Style Commerce',
    description: 'Curated apparel, weekly drops, and fast checkout designed for modern shoppers.',
    type: 'website',
    url: 'https://cara-store.example',
    siteName: 'Cara Studio',
    images: [{ url: '/banner-img/b1.jpg', width: 1200, height: 630, alt: 'Cara Studio shopping collection' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cara Studio | Mobile-first Style Commerce',
    description: 'Curated apparel, weekly drops, and fast checkout designed for modern shoppers.',
    images: ['/banner-img/b1.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="shortcut icon" href="/extra-img/giphy.webp" type="image/x-icon" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Cart />
          <Footer />
          <Loader />
        </CartProvider>
      </body>
    </html>
  );
}
