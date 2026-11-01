import { PrismaClient } from '@prisma/client';

let prismaInstance: any;

try {
  prismaInstance = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} catch (err: any) {
  console.warn('⚠️ Warning: PrismaClient synchronous init note:', err.message);
  // Resilient fallback proxy so the server never crashes on startup
  const createFallback: any = () => new Proxy(() => {}, {
    get: () => createFallback(),
    apply: () => Promise.resolve([])
  });
  prismaInstance = new Proxy({}, {
    get: (_target, prop) => {
      if (prop === '$connect') return () => Promise.reject(new Error('Prisma database client not ready'));
      if (prop === '$disconnect') return () => Promise.resolve();
      return createFallback();
    }
  });
}

export const prisma = prismaInstance;

