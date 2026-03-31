import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Loader from '@/components/Loader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cara Store',
  description: 'An e-commerce website',
  keywords: 'website, shop, e-commerce, shopping website, boutique',
  authors: [{ name: 'joshua onyeka' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
