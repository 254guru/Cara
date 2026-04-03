import { Product } from '@/types';
import { prisma } from '@/lib/prisma';
import { scrapeFashionCatalog } from '@/lib/catalog';
import { unstable_cache } from 'next/cache';

/* ──────────────────────────────────────────────────────────
 * These helpers read from the database first and can fall back
 * to live catalog scraping if DB reads fail.
 * ────────────────────────────────────────────────────────── */

const PRODUCT_SELECT = {
  id: true,
  source: true,
  externalId: true,
  brand: true,
  title: true,
  description: true,
  price: true,
  image: true,
  rating: true,
  fullRating: true,
  category: true,
  inStock: true,
} as const;

async function listProductsUncached(limit = 120): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      select: PRODUCT_SELECT,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    if (products.length > 0) return products as Product[];
  } catch {
    return [];
  }

  try {
    const scraped = await scrapeFashionCatalog(limit);
    return scraped.map((item, idx) => ({
      id: idx + 1,
      source: item.source,
      externalId: item.externalId,
      brand: item.brand,
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      rating: item.rating,
      fullRating: item.fullRating,
      category: item.category,
      inStock: true,
    }));
  } catch {
    return [];
  }
}

const getShopProductsCached = unstable_cache(
  async () => listProductsUncached(120),
  ['products:shop:v1'],
  { revalidate: 20 },
);

const getFeaturedProductsCached = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        where: { inStock: true },
        select: PRODUCT_SELECT,
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
        take: 8,
      });

      return products as Product[];
    } catch {
      return [];
    }
  },
  ['products:featured:v1'],
  { revalidate: 20 },
);

const getNewArrivalsCached = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        where: { inStock: true },
        select: PRODUCT_SELECT,
        orderBy: { createdAt: 'desc' },
        take: 8,
      });

      return products as Product[];
    } catch {
      return [];
    }
  },
  ['products:new-arrivals:v1'],
  { revalidate: 20 },
);

async function getProductByIdUncached(id: number): Promise<Product | undefined> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: PRODUCT_SELECT,
    });
    if (product) return product as Product;
  } catch {
    return undefined;
  }

  return undefined;
}

export async function getShopProductsFromDB(): Promise<Product[]> {
  return getShopProductsCached();
}

export async function getProductByIdFromDB(id: number): Promise<Product | undefined> {
  const getByIdCached = unstable_cache(
    async () => getProductByIdUncached(id),
    [`products:by-id:${id}:v1`],
    { revalidate: 20 },
  );

  return getByIdCached();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getFeaturedProductsCached();
}

export async function getNewArrivals(): Promise<Product[]> {
  return getNewArrivalsCached();
}

export async function getShopProducts(): Promise<Product[]> {
  return getShopProductsCached();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  return getProductByIdFromDB(id);
}

export async function getAllProductIds(): Promise<number[]> {
  try {
    const ids = await prisma.product.findMany({
      where: { inStock: true },
      select: { id: true },
      orderBy: { id: 'asc' },
      take: 500,
    });

    return ids.map((x) => x.id);
  } catch {
    return [];
  }
}
