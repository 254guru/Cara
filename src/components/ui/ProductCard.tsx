'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { buildStarClasses, formatPrice } from '@/lib/utils';

interface Props {
  product: Product;
  showAddToCart?: boolean;
  linkTo?: string;
}

export default function ProductCard({ product, showAddToCart = false, linkTo = '/shop' }: Props) {
  const { addItem } = useCart();
  const stars = buildStarClasses(product.fullRating);

  return (
    <div className={`box${showAddToCart ? ' box-content' : ''}`}>
      <div className="image">
        <Link href={linkTo}>
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            className={showAddToCart ? 'product-img smallImg' : ''}
            loading="lazy"
          />
        </Link>
      </div>
      <div className={`content${showAddToCart ? ' shop-content' : ''}`}>
        <h3>{product.brand}</h3>
        <p className={showAddToCart ? 'product-title' : ''}>{product.title}</p>
        {!showAddToCart && (
          <div className="stars">
            {stars.map((cls, i) => <i key={i} className={cls} />)}
          </div>
        )}
        <div className="price">
          <h6 id="prices">{formatPrice(product.price)}</h6>
          <span>
            <i
              className="fas fa-shopping-cart"
              onClick={() => addItem(product)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`Add ${product.title} to cart`}
            />
          </span>
        </div>
      </div>
      {showAddToCart && (
        <button className="addBtn" onClick={() => addItem(product)}>add to cart</button>
      )}
    </div>
  );
}
