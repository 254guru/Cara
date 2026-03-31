'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';

const thumbnailImages = [
  '/products-img/p2.jpg', '/products-img/p3.jpg', '/products-img/p4.jpg',
  '/products-img/p1.jpg', '/products-img/p5.jpg', '/products-img/p6.jpg',
];

export default function ProductDetailClient({ product }: { product: Product }) {
  const [mainImg, setMainImg] = useState(product.image);
  const { addItem } = useCart();

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
                      style={{ cursor: 'pointer' }}
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
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} className={product.fullRating ? 'fas fa-star' : i < 4 ? 'fas fa-star' : 'fas fa-star-half-alt'} />
              ))}
            </div>
            <h2 className="product-price">${product.price}</h2>
            <select name="size" className="product-size">
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <div className="btn-group" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="addBtn" onClick={() => addItem(product)}>add to cart</button>
              <Link href="/shop" className="btn">back to shop</Link>
            </div>
            <p style={{ marginTop: '1rem', color: '#777', lineHeight: 1.7 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis saepe optio vel labore iusto exercitationem non laudantium id ea, molestias doloremque fugit praesentium corporis dolorum distinctio!
            </p>
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
