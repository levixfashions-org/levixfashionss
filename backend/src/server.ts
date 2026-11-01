import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

const primaryPort = Number(process.env.PORT) || 3000;
const fallbackPort = 4000;

async function bootstrap() {
  try {
    const server = app.listen(primaryPort, '0.0.0.0', () => {
      console.log(`✓ Levix primary server listening on port ${primaryPort} [${env.NODE_ENV}]`);
    });

    if (primaryPort !== fallbackPort) {
      try {
        const backupServer = http.createServer(app);
        backupServer.listen(fallbackPort, '0.0.0.0', () => {
          console.log(`✓ Levix fallback server listening on port ${fallbackPort}`);
        });
      } catch (_) {
        // Fallback port optional
      }
    }

    // Non-blocking database connection
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
    console.error('CRITICAL: Server startup caught error:', err.message);
  }
}

bootstrap();
