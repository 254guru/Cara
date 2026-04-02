/**
 * Persists per-source scrape results into CatalogSource rows.
 * Safe to call from both the cron route and the CLI script.
 */
import type { PrismaClient } from '@prisma/client';
import {
  CATALOG_SOURCES,
  SOURCE_HEALTH_SKIP_THRESHOLD,
  computeNewScore,
  type SourceRunResult,
} from '@/lib/catalog';

type CatalogSourceDelegate = PrismaClient['catalogSource'];

type PrismaLike = Pick<PrismaClient, '$transaction'> & {
  catalogSource: CatalogSourceDelegate;
};

export async function recordSourceRuns(
  db: PrismaLike,
  results: SourceRunResult[],
): Promise<void> {
  for (const run of results) {
    const existing = await db.catalogSource.findUnique({
      where: { name: run.name },
    });

    // Resolve source URL from the registry (the DB row may not exist yet).
    const sourceDef = CATALOG_SOURCES.find((s) => s.name === run.name);
    const displayName = run.displayName || sourceDef?.displayName || run.name;
    const url = sourceDef?.url || '';

    const currentScore = existing ? existing.healthScore : 1.0;
    const currentFails = existing ? existing.consecutiveFails : 0;
    const totalRuns = (existing?.totalRuns ?? 0) + 1;
    const totalOkRuns = (existing?.totalOkRuns ?? 0) + (run.ok ? 1 : 0);

    const newScore = computeNewScore(
      currentScore,
      run.ok ? 0 : currentFails,
      run.ok,
      run.itemCount,
    );
    const newConsecutiveFails = run.ok ? 0 : currentFails + 1;

    await db.catalogSource.upsert({
      where: { name: run.name },
      update: {
        healthScore: newScore,
        consecutiveFails: newConsecutiveFails,
        totalRuns,
        totalOkRuns,
        lastRunAt: new Date(),
        lastRunOk: run.ok,
        lastItemCount: run.itemCount,
        displayName,
        url,
      },
      create: {
        name: run.name,
        displayName,
        url,
        healthScore: newScore,
        consecutiveFails: newConsecutiveFails,
        totalRuns,
        totalOkRuns,
        lastRunAt: new Date(),
        lastRunOk: run.ok,
        lastItemCount: run.itemCount,
      },
    });
  }
}

/**
 * Load the names of sources that should be skipped in the next run
 * because their health score has dropped below the threshold.
 */
export async function getSkippedSources(db: PrismaLike): Promise<string[]> {
  const rows = await db.catalogSource.findMany({
    where: { healthScore: { lt: SOURCE_HEALTH_SKIP_THRESHOLD } },
    select: { name: true },
  });
  return rows.map((r: { name: string }) => r.name);
}

/**
 * Pretty-print a health table to the console.
 */
export function printHealthTable(results: SourceRunResult[]): void {
  console.log('\n── Source Health After Run ──────────────────────────');
  for (const r of results) {
    const status = r.ok ? '✓' : '✗';
    const items = r.ok ? `${r.itemCount} items` : r.error ?? 'failed';
    const ms = `${r.durationMs}ms`;
    console.log(`  [${status}] ${r.displayName.padEnd(24)} ${items.padEnd(16)} ${ms}`);
  }
  console.log('────────────────────────────────────────────────────\n');
}
