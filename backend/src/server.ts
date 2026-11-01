import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (env.PORT || 4000);

async function bootstrap() {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Levix production server actively listening on port ${PORT} [${env.NODE_ENV}]`);
    });

    // Connect to database in non-blocking mode so HTTP server stays up
    prisma.$connect().then(() => {
      console.log('✓ Connected to MySQL database via Prisma ORM.');
    }).catch((dbErr: any) => {
      console.warn('⚠️ Database connection note:', dbErr.message);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Gracefully terminating server...`);
      server.close(async () => {
        try { await prisma.$disconnect(); } catch (_) {}
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
