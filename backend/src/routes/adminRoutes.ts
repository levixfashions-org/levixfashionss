import { Router } from 'express';
import {
  getDashboardMetrics,
  getAllOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminStoreSettings,
  updateAdminStoreSettings,
  getAdminDiscounts,
  createAdminDiscount,
  deleteAdminDiscount
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
router.get('/settings', getAdminStoreSettings);
router.post('/settings', updateAdminStoreSettings);
router.get('/discounts', getAdminDiscounts);
router.post('/discounts', createAdminDiscount);
router.delete('/discounts/:id', deleteAdminDiscount);

export default router;
