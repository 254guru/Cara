import Link from 'next/link';
import Newsletter from '@/components/sections/Newsletter';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ProductCard from '@/components/ui/ProductCard';
import { getFeaturedProducts, getNewArrivals } from '@/services/productService';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Homepage',
  description: 'Shop curated everyday pieces with mobile-first browsing, instant cart actions, and weekly style drops.',
  openGraph: {
    title: 'Cara Stores Homepage',
    description: 'Discover top picks, fresh arrivals, and seasonal collections from Cara Stores.',
    images: ['/banner-img/b2.webp'],
  },
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();

  return (
    <>
      <section className="home" id="home">
        <div className="hero-shell">
          <div className="content">
            <span className="pill">2026 Drop</span>
            <h2>Built for scroll speed</h2>
            <h1>Dress better, faster</h1>
            <p>Discover premium essentials curated for movement, comfort, and bold everyday styling.</p>
            <div className="cta-row">
              <Link href="/shop" className="btn-primary">Shop collection</Link>
              <Link href="/about" className="btn-secondary">Our story</Link>
            </div>
            <div className="kpi-grid" aria-label="Store highlights">
              <div className="kpi-card"><strong>24h</strong><p>Dispatch on most orders</p></div>
              <div className="kpi-card"><strong>16k+</strong><p>Happy mobile shoppers</p></div>
              <div className="kpi-card"><strong>4.9/5</strong><p>Average review score</p></div>
              <div className="kpi-card"><strong>Easy</strong><p>Returns within 14 days</p></div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <section className="products" id="products">
        <div className="section-heading">
          <span className="pill">Top Picks</span>
          <h2>Featured right now</h2>
          <p>Editor-approved essentials that pair clean lines with all-day comfort.</p>
        </div>
        <div className="box-container">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} linkTo={`/shop/${p.id}`} />
          ))}
        </div>
      </section>

      <section className="banner" id="banner">
        <div className="content">
          <span className="pill">Limited Time</span>
          <h1>Seasonal markdown event</h1>
          <p>Save up to <span>70% off</span> selected essentials and accessories.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link href="/shop" className="btn">Explore deals</Link>
          </div>
        </div>
      </section>

      <section className="arrivals" id="arrivals">
        <div className="section-heading">
          <span className="pill">Just In</span>
          <h2>New arrivals this week</h2>
          <p>Fresh silhouettes and color stories dropping every Friday at noon.</p>
        </div>
        <div className="box-container">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} linkTo={`/shop/${p.id}`} />
          ))}
        </div>
      </section>

      <section className="adverts" id="adverts">
        <div className="ad-container-1">
          <div className="box ad-1">
            <div className="content">
              <h4>Members perk</h4>
              <h1>Buy 1, get 1 50% off</h1>
              <p>Stack your wardrobe with bundle pricing on selected pieces.</p>
              <Link href="/shop" className="ad-btn">Unlock offer</Link>
            </div>
          </div>
          <div className="box ad-2">
            <div className="content">
              <h4>Spring / Summer</h4>
              <h1>Lightweight layers</h1>
              <p>Ready-to-wear cuts designed for warm city days.</p>
              <Link href="/shop" className="ad-btn">Shop now</Link>
            </div>
          </div>
        </div>
        <div className="ad-container-2">
          <div className="box ad-1"><div className="content"><h1>Season closeout</h1><p>Last chance pieces up to 50% off</p></div></div>
          <div className="box ad-2"><div className="content"><h1>Footwear capsule</h1><p>Comfort-driven silhouettes in stock now</p></div></div>
          <div className="box ad-3"><div className="content"><h1>Graphic tees</h1><p>New prints inspired by street culture</p></div></div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
