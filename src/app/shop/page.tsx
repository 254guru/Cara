import Newsletter from '@/components/sections/Newsletter';
import ShopAISearch from '@/components/ai/ShopAISearch';
import { getShopProductsFromDB } from '@/services/productService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse all Cara Stores products with fast filtering, mobile-first cards, and instant add-to-cart actions.',
  openGraph: {
    title: 'Shop Cara Stores',
    description: 'Explore curated apparel and accessories built for everyday movement.',
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
            <h1>Everything in one scroll</h1>
            <p>Discover all drops, add favorites instantly, and check out in minutes from any device.</p>
          </div>
        </div>
      </section>

      <section className="shop" id="shop">
        <ShopAISearch initialProducts={shopProducts} />
      </section>

      <Newsletter />
    </>
  );
}
