'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

export default function ShopAISearch({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Product[] | null>(null);

  const products = useMemo(() => {
    if (!result) return initialProducts;
    return result;
  }, [initialProducts, result]);

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setResult(null);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/products/nl-search?q=${encodeURIComponent(trimmed)}&limit=24`);
      if (!res.ok) {
        throw new Error('Search request failed');
      }
      const data = (await res.json()) as { products: Product[] };
      setResult(data.products || []);
    } catch {
      setResult([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="ai-search-shell">
        <h2>AI Product Search</h2>
        <p>Use natural language like: blue t-shirt under 3000 for weekend wear.</p>
        <form className="ai-search-row" onSubmit={(e) => void runSearch(e)}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your ideal product"
          />
          <button type="submit" disabled={busy}>{busy ? 'Searching...' : 'Search'}</button>
          {result && (
            <button type="button" onClick={() => { setQuery(''); setResult(null); }}>
              Reset
            </button>
          )}
        </form>
      </div>

      <div className="shop-items">
        <div className="box-container">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} showAddToCart linkTo={`/shop/${p.id}`} />
          ))}
        </div>
      </div>
    </>
  );
}
