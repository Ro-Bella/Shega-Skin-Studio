// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
  authAdmin, 
  createAdmin, 
  getAdmins, 
  updateAdmin, 
  deleteAdmin,
  authSuperAdmin // 1. ይህንን መጨመርዎን ያረጋግጡ
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.post('/super-login', authSuperAdmin); // 2. ይህንን መስመር ይጨምሩ

// ሌሎች ነባር ራውቶች (ለምሳሌ createAdmin, getAdmins...)
router.route('/')
  .post(protect, admin, createAdmin)
  .get(protect, admin, getAdmins);

router.route('/:id')
  .put(protect, admin, updateAdmin)
  .delete(protect, admin, deleteAdmin);

module.exports = router;
