import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from 'prisma/config';

function loadDatabaseUrlFromEnvFile(): string | undefined {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return undefined;

  const content = fs.readFileSync(envPath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith('DATABASE_URL='));

  if (!line) return undefined;

  const raw = line.slice('DATABASE_URL='.length).trim();
  return raw.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

const databaseUrl = process.env.DATABASE_URL || loadDatabaseUrlFromEnvFile();

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: databaseUrl,
  },
});
