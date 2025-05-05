// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');
// Middleware authenticateToken sudah diterapkan di routes/index.js
// Anda bisa tambahkan middleware otorisasi spesifik di sini jika perlu
// const { authorizeSales } = require('../middlewares/authMiddleware');

// Rute untuk membuat order manual (Akuisisi/Retensi)
// Mungkin perlu role SALES_ACQUISITION atau SALES_RETENTION?
// router.post('/', authorizeSales, orderController.createManualOrder);
router.post('/', orderController.createManualOrder); // Untuk sekarang, semua yg login bisa

// Tambahkan rute lain untuk order di sini nanti
// router.get('/', orderController.getAllOrders);
// router.get('/:id', orderController.getOrderById);
// router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;