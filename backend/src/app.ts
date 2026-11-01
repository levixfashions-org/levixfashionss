import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? [env.FRONTEND_URL, 'https://localhost', 'http://localhost'] 
    : '*',
  credentials: true
}));

app.use(express.json({
  limit: '5mb',
  verify: (req: any, res, buf) => {
    // Preserve raw body for Razorpay webhook HMAC verification
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global Rate Limiter
app.use('/api', apiRateLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
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

// Centralized Error Handling
app.use(errorHandler);
