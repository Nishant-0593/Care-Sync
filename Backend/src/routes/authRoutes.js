const express = require('express');
const { register, login, forgotPassword, resetPassword, checkAdminExists, logout, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/admin-exists', checkAdminExists);

module.exports = router;
