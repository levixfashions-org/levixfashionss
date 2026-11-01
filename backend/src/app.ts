import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

export const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const cleanFrontendUrl = (env.FRONTEND_URL || '').replace(/\/+$/, '');
const allowedOrigins = new Set([
  cleanFrontendUrl,
  'https://thelevix.shop',
  'https://www.thelevix.shop',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost'
]);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (env.NODE_ENV !== 'production' || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({
  limit: '5mb',
  verify: (req: any, _res: any, buf: Buffer) => {
    // Preserve raw body for Razorpay webhook HMAC verification
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global Rate Limiter
app.use('/api', apiRateLimiter);

// Health Check Endpoint
app.get('/api/health', (_req: any, res: any) => {
  res.json({
    status: 'ok',
    service: 'levix-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeEnv: env.NODE_ENV
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Path resolution for static files
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const possiblePaths = [
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(currentDir, '../../frontend/dist'),
  path.resolve(currentDir, '../frontend/dist'),
  path.resolve(currentDir, 'frontend/dist'),
  './frontend/dist'
];

const frontendDist = possiblePaths.find(p => {
  try {
    return fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'));
  } catch (_) {
    return false;
  }
}) || '';

if (frontendDist) {
  console.log(`✓ Serving frontend static files from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.warn('⚠️ Frontend dist directory not found in known locations. Checked:', possiblePaths);
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.status(200).send('<h1>LEVIX Production Server Online</h1><p>Storefront is initializing. Please refresh in a moment.</p>');
  });
}

// Centralized Error Handling
app.use(errorHandler);
