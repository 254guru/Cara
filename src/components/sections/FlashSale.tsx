'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

function useCountdown() {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    function calc() {
      const now = new Date();
      const target = new Date(now);
      target.setHours(20, 0, 0, 0); // 8 pm local
      if (target <= now) target.setDate(target.getDate() + 1);
      return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    }
    setSecs(calc());
    const id = setInterval(() => setSecs(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return { h, m, s };
}

export default function FlashSale({ products }: { products: Product[] }) {
  const { h, m, s } = useCountdown();

  return (
    <section className="flash-sale">
      <div className="flash-header">
        <div className="flash-title">
          <i className="fas fa-bolt flash-bolt" aria-hidden />
          <h2>Flash Deals</h2>
        </div>
        <div className="flash-countdown" aria-label="Sale countdown">
          <span className="ends-in">Ends in</span>
          <div className="cblocks">
            <div className="cblock"><strong>{h}</strong><span>hrs</span></div>
            <div className="csep">:</div>
            <div className="cblock"><strong>{m}</strong><span>min</span></div>
            <div className="csep">:</div>
            <div className="cblock"><strong>{s}</strong><span>sec</span></div>
          </div>
        </div>
        <Link href="/shop" className="view-all-link">
          See all <i className="fas fa-chevron-right" aria-hidden />
        </Link>
      </div>
      <div className="flash-scroll">
        {products.map((p) => (
          <div key={p.id} className="flash-item">
            <ProductCard product={p} linkTo={`/shop/${p.id}`} showAddToCart />
          </div>
        ))}
      </div>
    </section>
  );
}
