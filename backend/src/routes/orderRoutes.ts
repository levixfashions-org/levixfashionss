import { Router } from 'express';
import { createOrder, getUserOrders, getOrderByNumber } from '../controllers/orderController.js';
import { optionalAuth, verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { checkoutRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', checkoutRateLimiter, optionalAuth, createOrder);
router.get('/my-orders', verifyFirebaseToken, getUserOrders);
router.get('/:orderNumber', optionalAuth, getOrderByNumber);

export default router;
