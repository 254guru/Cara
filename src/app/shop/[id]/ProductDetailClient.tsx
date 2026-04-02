'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import Newsletter from '@/components/sections/Newsletter';
import { PRODUCT_SIZES } from '@/constants';
import { buildStarClasses, formatPrice } from '@/lib/utils';

const thumbnailImages = [
  '/products-img/p2.webp', '/products-img/p3.webp', '/products-img/p4.webp',
  '/products-img/p1.webp', '/products-img/p5.webp', '/products-img/p6.webp',
];

export default function ProductDetailClient(
  { product, recommendations = [] }: { product: Product; recommendations?: Product[] },
) {
  const [mainImg, setMainImg] = useState(product.image);
  const { addItem } = useCart();
  const stars = buildStarClasses(product.fullRating);

  return (
    <>
      <section className="product-details" id="product-details">
        <div className="box-container">
          <div className="box">
            <div className="pro-images">
              <Image src={mainImg} alt={product.title} id="mainImg" width={400} height={400} />
              <div className="small-img-wrap">
                {thumbnailImages.map((src, i) => (
                  <div className="small-img" key={i}>
                    <Image
                      src={src}
                      alt={`View ${i + 1}`}
                      className="smallImg"
                      width={80}
                      height={80}
                      onClick={() => setMainImg(src)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="box pro-info">
            <h2 className="product-name">{product.title}</h2>
            <h3 className="product-brand">{product.brand}</h3>
            <div className="stars">
              {stars.map((cls, i) => (
                <i key={i} className={cls} />
              ))}
            </div>
            <h2 className="product-price">{formatPrice(product.price)}</h2>
            <select name="size" className="product-size">
              {PRODUCT_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <div className="btn-group">
              <button className="addBtn" onClick={() => addItem(product)}>Add to cart</button>
              <Link href="/shop" className="btn">Back to shop</Link>
            </div>
            <p>
              Crafted for daily wear, this piece features breathable fabric, a clean silhouette, and elevated finishing.
              Pair it with relaxed denim, layered outerwear, or minimal sneakers for a versatile city-ready look.
            </p>
            <div className="kpi-grid" style={{ marginTop: '1rem' }}>
              <div className="kpi-card"><strong>Free</strong><p>Shipping over KES 12,000</p></div>
              <div className="kpi-card"><strong>14 days</strong><p>Easy returns</p></div>
              <div className="kpi-card"><strong>Secure</strong><p>Encrypted checkout</p></div>
              <div className="kpi-card"><strong>Support</strong><p>Live chat daily</p></div>
            </div>
          </div>
        </div>
      </section>

      {recommendations.length > 0 && (
        <section className="complete-look" aria-label="Complete the look">
          <div className="section-heading">
            <h2>Complete The Look</h2>
            <p>AI-picked matches based on style, silhouette, and product context.</p>
          </div>
          <div className="box-container">
            {recommendations.map((item) => (
              <div key={item.id} className="box">
                <div className="image">
                  <Image src={item.image} alt={item.title} width={240} height={240} />
                </div>
                <div className="content">
                  <h3>{item.brand}</h3>
                  <p className="product-title">{item.title}</p>
                  <div className="price">
                    <h6 id="prices">{formatPrice(item.price)}</h6>
                    <button className="icon-btn-small" onClick={() => addItem(item)} type="button" aria-label={`Add ${item.title} to cart`}>
                      <i className="fas fa-shopping-bag" />
                    </button>
                  </div>
                  <Link href={`/shop/${item.id}`} className="btn" style={{ marginTop: '0.5rem' }}>
                    View Item
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
