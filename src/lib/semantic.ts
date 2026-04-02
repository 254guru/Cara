import { prisma } from '@/lib/prisma';
import { getEmbedding } from '@/lib/ai';
import { scrapeFashionCatalog } from '@/lib/catalog';
import type { Product } from '@/types';
import { randomUUID } from 'crypto';

type DbProduct = Product & {
  description?: string;
  category?: string;
  inStock?: boolean;
};

let lastEmbeddingSyncAt = 0;

function vectorLiteral(v: number[]): string {
  return `[${v.join(',')}]`;
}

function toSearchText(p: DbProduct): string {
  return `${p.brand} ${p.title} ${p.category || ''} ${p.description || ''}`.trim();
}

function keywordScore(p: DbProduct, terms: string[]): number {
  const haystack = toSearchText(p).toLowerCase();
  return terms.reduce((acc, t) => (haystack.includes(t) ? acc + 2 : acc), 0);
}

async function getDbProducts(limit = 250): Promise<DbProduct[]> {
  const rows = await prisma.product.findMany({
    where: { inStock: true },
    select: {
      id: true,
      brand: true,
      title: true,
      price: true,
      image: true,
      rating: true,
      fullRating: true,
      description: true,
      category: true,
      inStock: true,
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return rows;
}

async function syncMissingEmbeddings(products: DbProduct[]): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return;

  const now = Date.now();
  if (now - lastEmbeddingSyncAt < 10 * 60 * 1000) return;

  try {
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector');
  } catch {
    return;
  }

  const ids = products.map((p) => p.id);
  if (!ids.length) return;

  let existing: Array<{ product_id: number }> = [];
  try {
    existing = await prisma.$queryRawUnsafe<Array<{ product_id: number }>>(
      `SELECT product_id FROM product_embeddings WHERE product_id = ANY($1::int[])`,
      ids,
    );
  } catch {
    return;
  }

  const existingSet = new Set(existing.map((r) => r.product_id));
  const missing = products.filter((p) => !existingSet.has(p.id)).slice(0, 30);

  for (const product of missing) {
    const embedding = await getEmbedding(toSearchText(product));
    if (!embedding) continue;

    const emb = vectorLiteral(embedding);
    await prisma.$executeRaw`
      INSERT INTO product_embeddings (id, product_id, source_text, embedding, created_at, updated_at)
      VALUES (${randomUUID()}, ${product.id}, ${toSearchText(product)}, ${emb}::vector, NOW(), NOW())
      ON CONFLICT (product_id)
      DO UPDATE SET source_text = EXCLUDED.source_text, embedding = EXCLUDED.embedding, updated_at = NOW()
    `;
  }

  lastEmbeddingSyncAt = now;
}

function keywordFallback(query: string, products: DbProduct[], limit: number): Product[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  return products
    .map((p) => ({ p, score: keywordScore(p, terms) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
    .slice(0, limit);
}

export async function semanticSearchProducts(query: string, limit = 12): Promise<Product[]> {
  let products: DbProduct[] = [];

  try {
    products = await getDbProducts(300);
  } catch {
    const scraped = await scrapeFashionCatalog(120);
    const mapped = scraped.map((item, idx) => ({
      id: idx + 1,
      brand: item.brand,
      title: item.title,
      price: item.price,
      image: item.image,
      rating: item.rating,
      fullRating: item.fullRating,
      description: item.description,
      category: item.category,
    }));
    return keywordFallback(query, mapped, limit);
  }

  await syncMissingEmbeddings(products);
  const embedding = await getEmbedding(query);
  if (!embedding) return keywordFallback(query, products, limit);

  const emb = vectorLiteral(embedding);

  try {
    const rows = await prisma.$queryRaw<Array<DbProduct>>`
      SELECT p.id, p.brand, p.title, p.price, p.image, p.rating, p."fullRating" AS "fullRating"
      FROM products p
      JOIN product_embeddings pe ON pe.product_id = p.id
      WHERE p."inStock" = true
      ORDER BY pe.embedding <=> ${emb}::vector
      LIMIT ${limit}
    `;

    if (rows.length > 0) return rows;
  } catch {
    return keywordFallback(query, products, limit);
  }

  return keywordFallback(query, products, limit);
}

export async function completeTheLook(productId: number, limit = 4): Promise<Product[]> {
  try {
    const products = await getDbProducts(300);
    await syncMissingEmbeddings(products);

    const rows = await prisma.$queryRaw<Array<Product>>`
      SELECT p.id, p.brand, p.title, p.price, p.image, p.rating, p."fullRating" AS "fullRating"
      FROM product_embeddings target
      JOIN product_embeddings pe ON pe.product_id <> target.product_id
      JOIN products p ON p.id = pe.product_id
      WHERE target.product_id = ${productId}
      AND p."inStock" = true
      ORDER BY target.embedding <=> pe.embedding
      LIMIT ${limit}
    `;

    if (rows.length > 0) return rows;

    return products.filter((p) => p.id !== productId).slice(0, limit);
  } catch {
    const scraped = await scrapeFashionCatalog(120);
    const mapped = scraped.map((item, idx) => ({
      id: idx + 1,
      brand: item.brand,
      title: item.title,
      price: item.price,
      image: item.image,
      rating: item.rating,
      fullRating: item.fullRating,
    }));
    return mapped.filter((p) => p.id !== productId).slice(0, limit);
  }
}
