import { Router } from 'express';
import {
  getDashboardMetrics,
  getAllOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminController.js';
import { verifyFirebaseToken, requireAdmin } from '../middleware/verifyFirebaseToken.js';

const router = Router();

router.use(verifyFirebaseToken);
router.use(requireAdmin);

router.get('/metrics', getDashboardMetrics);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
