import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from 'prisma/config';

function loadDatabaseUrlFromEnvFile(): string | undefined {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return undefined;

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const candidates = ['DATABASE_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL'];

  for (const key of candidates) {
    const line = lines.find((l) => l.trim().startsWith(`${key}=`));
    if (!line) continue;

    const raw = line.slice(`${key}=`.length).trim();
    return raw.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }

  return undefined;
}

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  loadDatabaseUrlFromEnvFile();

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrations: {
    seed: 'pnpm exec tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
