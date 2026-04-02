import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { scrapeFashionCatalog } from '../src/lib/catalog';
import type { Prisma } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('DATABASE_URL is not set and .env file was not found.');
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith('DATABASE_URL='));

  if (!line) {
    throw new Error('DATABASE_URL is not set and was not found in .env.');
  }

  return line
    .slice('DATABASE_URL='.length)
    .trim()
    .replace(/^"|"$/g, '')
    .replace(/^'|'$/g, '');
}

const adapter = new PrismaPg({ connectionString: resolveDatabaseUrl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo user
  const passwordHash = await hash('demo1234', 12);
  await prisma.user.upsert({
    where: { email: 'demo@carastores.co.ke' },
    update: {},
    create: {
      name: 'Demo Shopper',
      email: 'demo@carastores.co.ke',
      phone: '254712345678',
      passwordHash,
      role: 'BUYER',
    },
  });
  console.log('  ✓ Demo user created (demo@carastores.co.ke / demo1234)');

  // Seed products from internet sources
  const scrapedProducts = await scrapeFashionCatalog(120);

  for (const product of scrapedProducts) {
    const whereBySourceExternal = {
      source_externalId: {
        source: product.source,
        externalId: product.externalId,
      },
    } as unknown as Prisma.ProductWhereUniqueInput;

    const createData = {
      source: product.source,
      externalId: product.externalId,
      brand: product.brand,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      rating: product.rating,
      fullRating: product.fullRating,
      category: product.category,
      inStock: true,
    } as unknown as Prisma.ProductCreateInput;

    await prisma.product.upsert({
      where: whereBySourceExternal,
      update: {
        brand: product.brand,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        rating: product.rating,
        fullRating: product.fullRating,
        category: product.category,
        inStock: true,
      },
      create: createData,
    });
  }
  console.log(`  ✓ ${scrapedProducts.length} products seeded from web sources`);

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
