// backend/routes/index.js
const express = require('express');
const router = express.Router();

// --- Impor rute ---
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes'); // <-- 1. Impor orderRoutes
const productRoutes = require('./productRoutes'); // Jika ada rute produk
// const storeConnectionRoutes = require('./storeConnectionRoutes');
// ...

// --- Impor middleware ---
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

// --- Mount rute ---
router.use('/auth', authRoutes); // Rute publik

router.use(authenticateToken); // Terapkan token untuk semua di bawah ini

router.use('/users', authorizeAdmin, userRoutes); // Khusus Admin
router.use('/orders', orderRoutes); // <-- 2. Mount orderRoutes (sudah terproteksi token)
router.use('/products', productRoutes); // Jika ada rute produk
// router.use('/store-connections', storeConnectionRoutes);
// ...

module.exports = router;