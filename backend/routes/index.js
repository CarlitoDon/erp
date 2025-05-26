// backend/routes/index.js
const express = require('express');
const router = express.Router();

// --- Impor rute ---
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
const warehouseRoutes = require('./warehouseRoutes');
const customerRoutes = require('./customerRoutes'); // <--- TAMBAHKAN BARIS INI

// --- Impor middleware ---
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

// --- Mount rute ---
router.use('/auth', authRoutes); // Rute publik

router.use(authenticateToken); // Terapkan token untuk semua di bawah ini

router.use('/users', authorizeAdmin, userRoutes); // Khusus Admin
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/warehouse', warehouseRoutes);
router.use('/customers', customerRoutes); // <--- TAMBAHKAN BARIS INI UNTUK CUSTOMER ROUTES

module.exports = router;