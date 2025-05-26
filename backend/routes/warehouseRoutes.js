// backend/routes/warehouseRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middlewares/authMiddleware');
const {
  getAllShippingProviders,
  addShippingProvider,
  deleteShippingProvider, // <-- Import fungsi delete
} = require('../controllers/shippingProviderController');

// Rute Shipping Providers
router.get('/shipping-providers', authenticateToken, authorize(['ADMIN', 'WAREHOUSE_STAFF']), getAllShippingProviders);
router.post('/shipping-providers', authenticateToken, authorize(['ADMIN']), addShippingProvider);
router.delete('/shipping-providers/:id', authenticateToken, authorize(['ADMIN']), deleteShippingProvider); // <-- Tambahkan rute DELETE

module.exports = router;