// backend/routes/authRoutes.js
const express = require('express');
const { login, forgotPassword, resetPassword, changePassword, protect } = require('../controllers/authController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.put('/change-password', authController.protect, authController.changePassword);

module.exports = router;
