import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let productionPrisma: PrismaClient | undefined;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  if (!/^postgres(ql)?:\/\//i.test(connectionString)) {
    throw new Error('DATABASE_URL must use postgresql:// or postgres://');
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

export function getPrisma(): PrismaClient {
  if (process.env.NODE_ENV !== 'production') {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma;
  }

  if (!productionPrisma) {
    productionPrisma = createPrismaClient();
  }

  return productionPrisma;
}
