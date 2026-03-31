import { featuredProducts, newArrivals, shopProducts } from '@/data/products';
import { Product } from '@/types';
import { prisma } from '@/lib/prisma';

/* ──────────────────────────────────────────────────────────
 * These helpers try the database first and fall back to the
 * static data arrays so the app keeps working without a DB.
 * ────────────────────────────────────────────────────────── */

export async function getShopProductsFromDB(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: 'desc' },
    });
    if (products.length > 0) return products;
  } catch { /* DB not available — use static data */ }
  return shopProducts;
}

export async function getProductByIdFromDB(id: number): Promise<Product | undefined> {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) return product;
  } catch { /* DB not available */ }
  return shopProducts.find((p) => p.id === id);
}

// ─── Original in-memory helpers (still used by pages that don't need DB) ─────

export function getFeaturedProducts(): Product[] {
  return featuredProducts;
}

export function getNewArrivals(): Product[] {
  return newArrivals;
}

export function getShopProducts(): Product[] {
  return shopProducts;
}

export function getProductById(id: number): Product | undefined {
  return shopProducts.find((p) => p.id === id);
}

export function getAllProductIds(): number[] {
  return shopProducts.map((p) => p.id);
}
