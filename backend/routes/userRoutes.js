const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.use(authorizeAdmin);

router.get('/', userController.getAllUsers); // <-- Pastikan ini ada (method GET ke path '/')
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;