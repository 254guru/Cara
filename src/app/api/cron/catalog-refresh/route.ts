import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeAllSources } from '@/lib/catalog';
import { recordSourceRuns, getSkippedSources } from '@/lib/sourceHealth';

export const maxDuration = 60; // Vercel max for Hobby plan

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;

  // If no secret is configured, only allow in development.
  if (!secret) {
    return process.env.NODE_ENV === 'development';
  }

  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const runStart = Date.now();

  // Load currently weak sources to skip them.
  let skipSources: string[] = [];
  try {
    skipSources = await getSkippedSources(prisma);
  } catch {
    // If DB is cold, proceed without skipping any source.
  }

  console.log(`[cron] catalog-refresh start — skipping: [${skipSources.join(', ') || 'none'}]`);

  // Scrape all healthy sources.
  const { items, results } = await scrapeAllSources({ limit: 200, skipSources });

  console.log(`[cron] scraped ${items.length} total items from ${results.length} sources`);

  // Upsert products into DB.
  let upserted = 0;
  let errors = 0;

  for (const item of items) {
    try {
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

      upserted += 1;
    } catch {
      errors += 1;
    }
  }

  // Record health scores.
  try {
    await recordSourceRuns(prisma, results);
  } catch {
    // Non-fatal: health scoring failure shouldn't abort cron.
  }

  const durationMs = Date.now() - runStart;

  console.log(`[cron] catalog-refresh done — ${upserted} upserted, ${errors} errors, ${durationMs}ms`);

  return NextResponse.json({
    ok: true,
    upserted,
    errors,
    durationMs,
    skipped: skipSources,
    sources: results.map((r) => ({
      name: r.name,
      ok: r.ok,
      itemCount: r.itemCount,
      durationMs: r.durationMs,
      ...(r.error ? { error: r.error } : {}),
    })),
  });
}
