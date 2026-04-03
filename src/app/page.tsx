import Link from 'next/link';
import Image from 'next/image';
import Newsletter from '@/components/sections/Newsletter';
import CategoryStrip from '@/components/sections/CategoryStrip';
import FlashSale from '@/components/sections/FlashSale';
import ProductCard from '@/components/ui/ProductCard';
import { getFeaturedProducts, getNewArrivals } from '@/services/productService';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Cara | Shop Online – Fashion, Beauty, Electronics & More',
  description: 'Shop the best deals on fashion, beauty, electronics and more at Cara Stores. Fast delivery, easy returns.',
  openGraph: {
    title: 'Cara Stores – Best Deals Online',
    description: 'Discover flash deals, top picks, and fresh arrivals every week at Cara Stores.',
    images: ['/banner-img/b2.webp'],
  },
};

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <>
      {/* Compact promotional hero */}
      <section className="home-hero">
        <div className="hero-promo-grid">
          <div className="hero-main-banner">
            <Image
              src="/banner-img/b2.webp"
              alt="Cara flash deals"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 719px) 92vw, (max-width: 1120px) 62vw, 720px"
              className="hero-main-media"
            />
            <div className="hero-banner-content">
              <span className="pill">Limited Time</span>
              <h1>Up to <span className="hero-pct">70% off</span> everyday essentials</h1>
              <p>Fashion, beauty, electronics and more — all in one place.</p>
              <Link href="/shop" className="btn-primary">Shop now</Link>
            </div>
          </div>
          <div className="hero-side-banners">
            <Link href="/shop?cat=beauty" className="hero-side-card">
              <span className="side-badge">Beauty</span>
              <h3>Skincare, serums & fragrances</h3>
            </Link>
            <Link href="/shop?cat=electronics" className="hero-side-card">
              <span className="side-badge">Electronics</span>
              <h3>Phones, laptops & gadgets</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <CategoryStrip />

      {/* Flash deals with countdown */}
      <FlashSale products={featuredProducts.slice(0, 8)} />

      {/* Featured products */}
      <section className="products" id="products">
        <div className="section-heading section-heading-row">
          <h2>Top picks for you</h2>
          <Link href="/shop" className="view-all-link">
            View all <i className="fas fa-chevron-right" aria-hidden />
          </Link>
        </div>
        <div className="box-container">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} linkTo={`/shop/${p.id}`} showAddToCart />
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="arrivals" id="arrivals">
        <div className="section-heading section-heading-row">
          <h2>New arrivals</h2>
          <Link href="/shop" className="view-all-link">
            View all <i className="fas fa-chevron-right" aria-hidden />
          </Link>
        </div>
        <div className="box-container">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} linkTo={`/shop/${p.id}`} showAddToCart />
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
