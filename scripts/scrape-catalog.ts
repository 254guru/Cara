import * as Prisma from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { scrapeAllSources, SOURCE_HEALTH_SKIP_THRESHOLD } from '../src/lib/catalog';
import { recordSourceRuns, getSkippedSources, printHealthTable } from '../src/lib/sourceHealth';
import fs from 'node:fs';
import path from 'node:path';

const { PrismaClient } = Prisma;

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
  const skipFlag = process.argv.includes('--skip-unhealthy');

  let skipSources: string[] = [];
  if (skipFlag) {
    try {
      skipSources = await getSkippedSources(prisma);
      if (skipSources.length) {
        console.log(`Skipping weak sources (score < ${SOURCE_HEALTH_SKIP_THRESHOLD}): ${skipSources.join(', ')}`);
      }
    } catch {
      console.warn('Could not load source health from DB — running all sources.');
    }
  }

  console.log('Scraping internet fashion catalog...');
  const { items, results } = await scrapeAllSources({ limit: 120, skipSources });

  printHealthTable(results);

  if (items.length === 0) {
    console.warn('No products scraped from any source.');
  } else {
    let upserts = 0;

    for (const item of items) {
      await prisma.product.upsert({
        where: {
          source_externalId: {
            source: item.source,
            externalId: item.externalId,
          },
        },
        update: {
          brand: item.brand,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.image,
          rating: item.rating,
          fullRating: item.fullRating,
          category: item.category,
          inStock: true,
        },
        create: {
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
        },
      });

      upserts += 1;
    }

    console.log(`Catalog sync complete: ${upserts} products upserted.`);
  }

  // Persist health scores from this run.
  try {
    await recordSourceRuns(prisma, results);
    console.log('Source health scores updated.');
  } catch {
    console.warn('DB unavailable — source health not persisted.');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

