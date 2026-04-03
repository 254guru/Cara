import * as Prisma from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = Prisma;

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient>;
};

function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  if (!url) {
    throw new Error(
      'Missing database URL. Set DATABASE_URL (or POSTGRES_PRISMA_URL/POSTGRES_URL on Vercel).',
    );
  }

  return url;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: getDatabaseUrl(),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
