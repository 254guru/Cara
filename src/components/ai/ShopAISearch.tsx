'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { CATEGORY_GROUPS, matchProductCategory } from '@/lib/deals';
import type { Product } from '@/types';

export default function ShopAISearch({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [activeCat, setActiveCat] = useState<string | null>(() => searchParams.get('cat'));
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Product[] | null>(null);

  // Auto-run search when ?q= is in URL on mount
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q) void runSearch(q);
    if (cat) setActiveCat(cat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = useMemo(() => {
    const base = result ?? initialProducts;
    if (!activeCat) return base;
    return base.filter((p) => matchProductCategory(p) === activeCat);
  }, [initialProducts, result, activeCat]);

  async function runSearch(override?: string) {
    const trimmed = (override ?? query).trim();
    if (!trimmed) { setResult(null); return; }
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

  function handleClear() {
    setQuery('');
    setResult(null);
    setActiveCat(null);
    router.replace('/shop');
  }

  return (
    <>
      <div className="ai-search-shell">
        <h2>AI Product Search</h2>
        <p>Use natural language like: blue t-shirt under 3000 for weekend wear.</p>
        <form className="ai-search-row" onSubmit={(e) => { e.preventDefault(); void runSearch(); }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your ideal product"
          />
          <button type="submit" disabled={busy}>{busy ? 'Searching...' : 'Search'}</button>
          {(result !== null || activeCat) && (
            <button type="button" onClick={handleClear}>Reset</button>
          )}
        </form>
      </div>

      {/* Category filter chips */}
      <div className="shop-cat-chips" role="group" aria-label="Filter by category">
        <button
          className={`shop-cat-chip${!activeCat ? ' active' : ''}`}
          onClick={() => setActiveCat(null)}
          type="button"
        >
          All
        </button>
        {CATEGORY_GROUPS.map((g) => (
          <button
            key={g.slug}
            className={`shop-cat-chip${activeCat === g.slug ? ' active' : ''}`}
            onClick={() => setActiveCat(activeCat === g.slug ? null : g.slug)}
            type="button"
          >
            <i className={`fas ${g.icon}`} aria-hidden />
            {g.label}
          </button>
        ))}
      </div>

      <div className="shop-items">
        <div className="box-container">
          {products.length > 0
            ? products.map((p) => (
                <ProductCard key={p.id} product={p} showAddToCart linkTo={`/shop/${p.id}`} />
              ))
            : <p className="empty-message">No products found. Try a different search or category.</p>
          }
        </div>
      </div>
    </>
  );
}
