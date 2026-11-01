import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

const rawPort = process.env.PORT || 3000;

async function bootstrap() {
  try {
    const isSocket = typeof rawPort === 'string' && isNaN(Number(rawPort));
    const port = isSocket ? rawPort : (Number(rawPort) || 3000);

    const server = isSocket
      ? app.listen(port, () => {
          console.log(`✓ Levix server listening on socket: ${port} [${env.NODE_ENV}]`);
        })
      : app.listen(port, '0.0.0.0', () => {
          console.log(`✓ Levix server listening on port: ${port} [${env.NODE_ENV}]`);
        });

    // Non-blocking database connection
    try {
      prisma.$connect?.().then(() => {
        console.log('✓ Connected to MySQL database via Prisma ORM.');
      }).catch((dbErr: any) => {
        console.warn('⚠️ Database connection note:', dbErr?.message || dbErr);
      });
    } catch (e: any) {
      console.warn('⚠️ Database initial call note:', e?.message || e);
    }

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

    return server;
  } catch (err: any) {
    console.error('CRITICAL: Server startup caught error:', err.message);
  }
}

const serverInstance = bootstrap();

export default app;
export { app, serverInstance };
