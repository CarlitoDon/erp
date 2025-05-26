// backend/routes/customerRoutes.js
const express = require('express'); // <--- UBAH INI
const { authenticateToken } = require('../middlewares/authMiddleware'); // <--- UBAH INI
const { checkPhoneNumberAvailability } = require('../controllers/customerController'); // <--- UBAH INI


const router = express.Router();

router.get('/check-phone', authenticateToken, checkPhoneNumberAvailability);

module.exports = router; // <--- UBAH INI