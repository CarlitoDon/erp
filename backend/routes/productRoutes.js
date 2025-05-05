// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Asumsikan pencarian produk bisa dilakukan oleh Sales Rep
// Middleware authenticateToken akan diterapkan di routes/index.js

router.get('/search', productController.searchProducts); // GET /api/products/search

// Tambahkan rute CRUD produk lain jika perlu (mungkin perlu authorizeAdmin)

module.exports = router;