import { Router } from 'express';
import { verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import { checkoutRateLimiter } from '../middleware/rateLimiter.js';
const router = Router();
router.post('/verify', checkoutRateLimiter, verifyPayment);
router.post('/webhook', handleWebhook);
export default router;
