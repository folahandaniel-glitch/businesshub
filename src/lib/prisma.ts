import { PrismaClient } from '@prisma/client';

/**
 * A single Prisma client is reused across hot reloads in development and
 * across warm serverless invocations in production.
 *
 * The placeholder URL exists only so the client can be constructed when
 * DATABASE_URL has not been set yet, for example on a first deployment
 * before the database is attached. Queries then fail inside the guarded
 * helpers in queries.ts, and the site renders its empty state rather than
 * crashing the whole build.
 */
const connectionString =
  process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
    ? process.env.DATABASE_URL
    : 'postgresql://unset:unset@localhost:5432/unset';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: connectionString } },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
