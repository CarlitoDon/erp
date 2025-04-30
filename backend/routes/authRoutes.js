// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 1. Pastikan path ini benar

// Rute untuk Login
// Pastikan authController.login adalah fungsi yang valid
router.post('/login', authController.login); // <-- Kemungkinan besar masalah ada di sini (baris 9?)

// Rute untuk Register
// Pastikan authController.register adalah fungsi yang valid
router.post('/register', authController.register);

// Tambahkan rute auth lain jika perlu (misal: refresh token)

module.exports = router;