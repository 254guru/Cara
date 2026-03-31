import Newsletter from '@/components/sections/Newsletter';
import ProductCard from '@/components/ui/ProductCard';
import { getShopProducts } from '@/services/productService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse all Cara Studio products with fast filtering, mobile-first cards, and instant add-to-cart actions.',
  openGraph: {
    title: 'Shop Cara Studio',
    description: 'Explore curated apparel and accessories built for everyday movement.',
    images: ['/banner-img/b7.webp'],
  },
};

export default function ShopPage() {
  const shopProducts = getShopProducts();

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
        <div className="shop-items">
          <div className="box-container">
            {shopProducts.map((p) => (
              <ProductCard key={p.id} product={p} showAddToCart linkTo={`/shop/${p.id}`} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
