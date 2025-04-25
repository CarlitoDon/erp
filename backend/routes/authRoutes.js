// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login, register, addStore } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
// Add a new route for adding a marketplace store
router.post("/add-store", addStore);

module.exports = router;
