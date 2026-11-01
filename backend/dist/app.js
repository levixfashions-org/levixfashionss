import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (env.NODE_ENV !== 'production' || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json({
    limit: '5mb',
    verify: (req, _res, buf) => {
        // Preserve raw body for Razorpay webhook HMAC verification
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
// Global Rate Limiter
app.use('/api', apiRateLimiter);
// Health Check Endpoint
app.get('/api/health', (_req, res) => {
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api'))
            return next();
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}
// Centralized Error Handling
app.use(errorHandler);
