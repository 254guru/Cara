export type CatalogItem = {
  source: string;
  externalId: string;
  brand: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  fullRating: boolean;
  category: string;
};

// Per-run stats returned for each source so callers can record health.
export type SourceRunResult = {
  name: string;
  displayName: string;
  url: string;
  ok: boolean;
  itemCount: number;
  durationMs: number;
  error?: string;
};

export type ScrapeResult = {
  items: CatalogItem[];
  results: SourceRunResult[];
};

// ─── Health score algorithm ──────────────────────────────────────────────────
// score ∈ [0.0, 1.0]; < 0.2 → source is auto-downranked (skipped for live fetch)
export const SOURCE_HEALTH_SKIP_THRESHOLD = 0.2;

export function computeNewScore(
  current: number,
  consecutiveFails: number,
  ok: boolean,
  itemCount: number,
): number {
  if (!ok) {
    // Exponential back-off: each consecutive fail multiplies the penalty.
    const penalty = 0.25 * (consecutiveFails + 1);
    return Math.max(0, current - penalty);
  }

  if (itemCount === 0) {
    // Responded fine but returned nothing — mild penalty.
    return Math.max(0, current - 0.1);
  }

  // Recovery: gradual climb back toward 1.0.
  return Math.min(1.0, current * 1.05 + 0.05);
}

const FASHION_TERMS = [
  'shirt',
  't-shirt',
  'tee',
  'hoodie',
  'jacket',
  'coat',
  'dress',
  'skirt',
  'jean',
  'pant',
  'trouser',
  'shoe',
  'sneaker',
  'fashion',
  'top',
  'blouse',
  'short',
  'bag',
];

function looksFashionLike(text: string): boolean {
  const lower = text.toLowerCase();
  return FASHION_TERMS.some((term) => lower.includes(term));
}

function usdToKes(value: number): number {
  const fx = Number(process.env.CATALOG_USD_TO_KES || '129');
  return Math.round(value * fx);
}

function normalizeCategory(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('shoe') || lower.includes('sneaker')) return 'shoes';
  if (lower.includes('dress')) return 'dresses';
  if (lower.includes('skirt')) return 'skirts';
  if (lower.includes('short')) return 'shorts';
  if (lower.includes('pant') || lower.includes('trouser') || lower.includes('jean')) return 'pants';
  if (lower.includes('hoodie') || lower.includes('jacket') || lower.includes('coat')) return 'outerwear';
  if (lower.includes('shirt') || lower.includes('top') || lower.includes('blouse') || lower.includes('tee')) return 'tops';
  return 'fashion';
}

function qualityFilter(item: CatalogItem): boolean {
  if (!item.title || item.title.length < 4) return false;
  if (!item.description || item.description.length < 16) return false;
  if (!item.image || !item.image.startsWith('http')) return false;
  if (!Number.isFinite(item.price) || item.price <= 0) return false;
  if (!looksFashionLike(`${item.title} ${item.description} ${item.category}`)) return false;
  return true;
}

// ─── Source registry ─────────────────────────────────────────────────────────

type SourceDef = {
  name: string;
  displayName: string;
  url: string;
  fetch: () => Promise<CatalogItem[]>;
};

// Internal fetch helpers (no health gating here — callers decide).
async function _fetchDummyJson(): Promise<CatalogItem[]> {
  const resp = await fetch('https://dummyjson.com/products?limit=120', {
    signal: AbortSignal.timeout(12_000),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

  const data = (await resp.json()) as {
    products?: Array<{
      id: number;
      title: string;
      description: string;
      price: number;
      brand?: string;
      category?: string;
      rating?: number;
      thumbnail?: string;
    }>;
  };

  return (data.products || [])
    .map((p) => {
      const rating = Number(p.rating || 4);
      return {
        source: 'dummyjson',
        externalId: String(p.id),
        brand: p.brand || 'Fashion House',
        title: p.title,
        description: p.description,
        price: usdToKes(Number(p.price || 0)),
        image: p.thumbnail || '',
        rating,
        fullRating: rating >= 4.8,
        category: normalizeCategory(p.category || 'fashion'),
      } satisfies CatalogItem;
    })
    .filter(qualityFilter);
}

async function _fetchFakeStore(): Promise<CatalogItem[]> {
  const resp = await fetch('https://fakestoreapi.com/products', {
    signal: AbortSignal.timeout(12_000),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

  const data = (await resp.json()) as Array<{
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: { rate?: number };
  }>;

  return data
    .map((p) => {
      const rating = Number(p.rating?.rate || 4);
      return {
        source: 'fakestore',
        externalId: String(p.id),
        brand: 'Global Fashion',
        title: p.title,
        description: p.description,
        price: usdToKes(Number(p.price || 0)),
        image: p.image,
        rating,
        fullRating: rating >= 4.8,
        category: normalizeCategory(p.category || 'fashion'),
      } satisfies CatalogItem;
    })
    .filter(qualityFilter);
}

export const CATALOG_SOURCES: SourceDef[] = [
  {
    name: 'dummyjson',
    displayName: 'DummyJSON Fashion',
    url: 'https://dummyjson.com/products?limit=120',
    fetch: _fetchDummyJson,
  },
  {
    name: 'fakestore',
    displayName: 'Fake Store API',
    url: 'https://fakestoreapi.com/products',
    fetch: _fetchFakeStore,
  },
];

// ─── Main scrape entrypoints ─────────────────────────────────────────────────

/**
 * Scrape all sources and return merged catalog + per-source run stats.
 * Sources with a healthScore below the threshold can be passed in `skipSources`
 * to be excluded from this run.
 */
export async function scrapeAllSources(opts?: {
  limit?: number;
  skipSources?: string[];
}): Promise<ScrapeResult> {
  const { limit = 120, skipSources = [] } = opts ?? {};

  const settled = await Promise.allSettled(
    CATALOG_SOURCES
      .filter((s) => !skipSources.includes(s.name))
      .map(async (s): Promise<{ result: SourceRunResult; items: CatalogItem[] }> => {
        const start = Date.now();
        try {
          const items = await s.fetch();
          return {
            result: {
              name: s.name,
              displayName: s.displayName,
              url: s.url,
              ok: true,
              itemCount: items.length,
              durationMs: Date.now() - start,
            },
            items,
          };
        } catch (err) {
          return {
            result: {
              name: s.name,
              displayName: s.displayName,
              url: s.url,
              ok: false,
              itemCount: 0,
              durationMs: Date.now() - start,
              error: err instanceof Error ? err.message : String(err),
            },
            items: [],
          };
        }
      }),
  );

  const results: SourceRunResult[] = [];
  const allItems: CatalogItem[] = [];

  for (const s of settled) {
    if (s.status === 'fulfilled') {
      results.push(s.value.result);
      allItems.push(...s.value.items);
    }
  }

  const dedup = new Map<string, CatalogItem>();
  for (const item of allItems) {
    const key = `${item.title.toLowerCase()}::${item.brand.toLowerCase()}`;
    if (!dedup.has(key)) dedup.set(key, item);
  }

  return {
    items: Array.from(dedup.values()).slice(0, limit),
    results,
  };
}

/**
 * Convenience helper — returns only items. Used by existing callers where
 * health score updating is not required (e.g. the static-fallback path).
 */
export async function scrapeFashionCatalog(limit = 80): Promise<CatalogItem[]> {
  const { items } = await scrapeAllSources({ limit });
  return items;
}
