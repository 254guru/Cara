import Newsletter from '@/components/sections/Newsletter';
import ProductCard from '@/components/ui/ProductCard';
import { getShopProducts } from '@/services/productService';

export const metadata = {
  title: 'Cara Store - Shop',
  description: 'Browse all products',
};

export default function ShopPage() {
  const shopProducts = getShopProducts();

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
