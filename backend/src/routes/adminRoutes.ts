import { Router } from 'express';
import {
  getDashboardMetrics,
  getAllOrders,
  updateOrderStatus,
  createProduct
} from '../controllers/adminController.js';
import { verifyFirebaseToken, requireAdmin } from '../middleware/verifyFirebaseToken.js';

const router = Router();

router.use(verifyFirebaseToken);
router.use(requireAdmin);

router.get('/metrics', getDashboardMetrics);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.post('/products', createProduct);

export default router;
