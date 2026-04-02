import { Product } from '@/types';
import { prisma } from '@/lib/prisma';
import { scrapeFashionCatalog } from '@/lib/catalog';

/* ──────────────────────────────────────────────────────────
 * These helpers try the database first and fall back to the
 * static data arrays so the app keeps working without a DB.
 * ────────────────────────────────────────────────────────── */

async function listProducts(limit = 120): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
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
      brand: item.brand,
      title: item.title,
      price: item.price,
      image: item.image,
      rating: item.rating,
      fullRating: item.fullRating,
    }));
  } catch {
    return [];
  }
}

export async function getShopProductsFromDB(): Promise<Product[]> {
  return listProducts(120);
}

export async function getProductByIdFromDB(id: number): Promise<Product | undefined> {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) return product as Product;
  } catch {
    return undefined;
  }

  return undefined;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      take: 8,
    });

    if (products.length > 0) return products as Product[];
  } catch {
    return [];
  }

  return [];
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    if (products.length > 0) return products as Product[];
  } catch {
    return [];
  }

  return [];
}

export async function getShopProducts(): Promise<Product[]> {
  return listProducts(120);
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
