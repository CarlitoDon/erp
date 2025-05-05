// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Import middleware otorisasi jika perlu (siapa yg boleh tambah produk?)
// const { authorizeAdminOrMarketplaceManager } = require('../middlewares/authMiddleware');

// Rute search (sudah ada)
router.get('/search', productController.searchProducts);

// --- TAMBAHKAN RUTE INI ---
// Rute untuk membuat produk baru
// Terapkan otorisasi jika perlu (misal: hanya Admin/Marketplace Manager)
// router.post('/', authorizeAdminOrMarketplaceManager, productController.createProduct);
router.post('/', productController.createProduct); // Untuk sekarang, semua yg login bisa (sesuai routes/index.js)
// --- AKHIR TAMBAHAN ---


// Tambahkan rute CRUD produk lain jika perlu (GET /, GET /:id, PUT /:id, DELETE /:id)

module.exports = router;