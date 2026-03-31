import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import FeaturesSection from '@/components/FeaturesSection';
import ProductCard from '@/components/ProductCard';
import { featuredProducts, newArrivals } from '@/data/products';

export const metadata = {
  title: 'Cara Store',
  description: 'An e-commerce website — save more with coupons & up to 70% off!',
};

export default function HomePage() {
  return (
    <>
      <section className="home" id="home">
        <div className="content">
          <h4>trade-in-offer</h4>
          <h2>Super value deals</h2>
          <h1>On all products</h1>
          <p>Save more with coupons &amp; up to 70% off!</p>
          <Link href="/shop"><button>shop now</button></Link>
        </div>
      </section>

      <FeaturesSection />

      <section className="products" id="products">
        <h1 className="heading">featured products</h1>
        <h4 className="sub-heading">Summer collections new modern design</h4>
        <div className="box-container">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} linkTo="/shop" />
          ))}
        </div>
      </section>

      <section className="banner" id="banner">
        <div className="content">
          <h4>repair services</h4>
          <p>up to <span>70% off</span> - all t-shirts &amp; accessories</p>
          <Link href="/shop" className="btn">explore more</Link>
        </div>
      </section>

      <section className="arrivals" id="arrivals">
        <h1 className="heading">new arrivals</h1>
        <h4 className="sub-heading">Summer collections new modern design</h4>
        <div className="box-container">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} linkTo="/shop" />
          ))}
        </div>
      </section>

      <section className="adverts" id="adverts">
        <div className="ad-container-1">
          <div className="box ad-1">
            <div className="content">
              <h4>crazy deals</h4>
              <h1>buy 1 get 1 free</h1>
              <p>The best classic dress is on sale at cara</p>
              <Link href="/shop" className="ad-btn">learn more</Link>
            </div>
          </div>
          <div className="box ad-2">
            <div className="content">
              <h4>spring/summer</h4>
              <h1>upcoming season</h1>
              <p>The best classic dress is on sale at cara</p>
              <Link href="/shop" className="ad-btn">continue</Link>
            </div>
          </div>
        </div>
        <div className="ad-container-2">
          <div className="box ad-1"><div className="content"><h1>season sale</h1><p>winter collection - 50% OFF</p></div></div>
          <div className="box ad-2"><div className="content"><h1>new footwear collection</h1><p>spring / summer 2024</p></div></div>
          <div className="box ad-3"><div className="content"><h1>t-shirts</h1><p>new trendy prints</p></div></div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
