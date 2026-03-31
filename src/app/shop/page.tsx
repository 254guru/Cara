import Newsletter from '@/components/Newsletter';
import ProductCard from '@/components/ProductCard';
import { shopProducts } from '@/data/products';

export const metadata = {
  title: 'Cara Store - Shop',
  description: 'Browse all products',
};

export default function ShopPage() {
  return (
    <>
      <section className="shop-banner">
        <div className="banner">
          <div className="content">
            <h1>#shopper</h1>
            <p>save more with coupon &amp; up to 70% off!</p>
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
