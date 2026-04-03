import Newsletter from '@/components/sections/Newsletter';
import { Suspense } from 'react';
import ShopAISearch from '@/components/ai/ShopAISearch';
import { getShopProductsFromDB } from '@/services/productService';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse fashion, beauty, electronics and more at Cara Stores. Filter by category, search with AI, and add to cart instantly.',
  openGraph: {
    title: 'Shop Cara Stores',
    description: 'Thousands of products across fashion, beauty, electronics and more — all in one place.',
    images: ['/banner-img/b7.webp'],
  },
};

export default async function ShopPage() {
  const shopProducts = await getShopProductsFromDB();

  return (
    <>
      <section className="shop-banner">
        <div className="banner">
          <div className="content">
            <span className="pill">Shop</span>
            <h1>Thousands of products, one place</h1>
            <p>Search by category, use AI to find exactly what you need, and check out in minutes.</p>
          </div>
        </div>
      </section>

      <section className="shop" id="shop">
        <Suspense fallback={<div className="shop-loading">Loading products…</div>}>
          <ShopAISearch initialProducts={shopProducts} />
        </Suspense>
      </section>

      <Newsletter />
    </>
  );
}
