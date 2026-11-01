import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

const PORT = env.PORT || 4000;

async function bootstrap() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    console.log('✓ Connected to MySQL database via Prisma ORM.');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Levix API server actively listening on http://0.0.0.0:${PORT} [${env.NODE_ENV}]`);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Gracefully terminating server...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err: any) {
    console.error('CRITICAL: Server failed to start:', err.message);
    process.exit(1);
  }
}

bootstrap();
