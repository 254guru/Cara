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

export default function ProductCard({ product, showAddToCart = false, linkTo }: Props) {
  const { addItem } = useCart();
  const stars = buildStarClasses(product.fullRating);
  const href = linkTo || `/shop/${product.id}`;

  return (
    <div className={`box${showAddToCart ? ' box-content' : ''}`}>
      <div className="image">
        <Link href={href} aria-label={`View ${product.title}`}>
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
        <p className={showAddToCart ? 'product-title' : ''}>
          <Link href={href} aria-label={`View ${product.title} details`}>{product.title}</Link>
        </p>
        <div className="stars" aria-label={`Rated ${product.rating} out of 5`}>
          {stars.map((cls, i) => <i key={i} className={cls} />)}
        </div>
        <div className="price">
          <h6 id="prices">{formatPrice(product.price)}</h6>
          <button className="icon-btn-small" onClick={() => addItem(product)} type="button" aria-label={`Add ${product.title} to cart`}>
            <i className="fas fa-shopping-bag" />
          </button>
        </div>
      </div>
      {showAddToCart && (
        <button className="addBtn" onClick={() => addItem(product)} type="button">Add to cart</button>
      )}
    </div>
  );
}
