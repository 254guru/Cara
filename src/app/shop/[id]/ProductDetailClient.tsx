'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import Newsletter from '@/components/sections/Newsletter';
import { buildStarClasses, formatPrice } from '@/lib/utils';
import { getDefaultProductUnit, getProductUnitConfig } from '@/lib/productUnits';

function toSentenceCase(input: string): string {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

function resolveProductDescription(product: Product): string {
  const text = (product.description || '').trim();
  if (text.length >= 24) return text;

  const category = product.category ? toSentenceCase(product.category) : 'Apparel';
  return `${category} piece from ${product.brand}, designed for everyday wear and easy styling.`;
}

export default function ProductDetailClient(
  { product, recommendations = [] }: { product: Product; recommendations?: Product[] },
) {
  const [mainImg, setMainImg] = useState(product.image);
  const [selectedUnit, setSelectedUnit] = useState(getDefaultProductUnit(product));
  const { addItem } = useCart();
  const stars = buildStarClasses(product.fullRating);
  const productDescription = resolveProductDescription(product);
  const unitConfig = getProductUnitConfig(product);
  const thumbnailImages = Array.from(
    new Set([product.image, ...recommendations.map((item) => item.image)].filter(Boolean)),
  ).slice(0, 6);

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
                      alt={`${product.title} view ${i + 1}`}
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
            {product.category && (
              <p className="product-category">Category: {toSentenceCase(product.category)}</p>
            )}
            <div className="stars">
              {stars.map((cls, i) => (
                <i key={i} className={cls} />
              ))}
            </div>
            <div className="product-purchase-row">
              <h2 className="product-price">{formatPrice(product.price)}</h2>
              <label className="product-unit-control">
                <span>{unitConfig.label}</span>
                <select
                  name="size"
                  className="product-size"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                >
                  {unitConfig.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="btn-group">
              <button className="addBtn" onClick={() => addItem(product, selectedUnit)}>Add to cart</button>
              <Link href="/shop" className="btn">Back to shop</Link>
            </div>
            <p>{productDescription}</p>
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
        <section className="complete-look" aria-label="Related products">
          <div className="section-heading">
            <h2>Related Products</h2>
            <p>Picked from the same product family to keep recommendations relevant.</p>
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
