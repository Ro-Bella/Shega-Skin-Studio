// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  authAdmin,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  authSuperAdmin,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import protect middleware

router.post('/login', authAdmin);
router.post('/super-login', authSuperAdmin);

router.route('/')
.post(protect, admin, createAdmin)
.get(protect, getAdmins);
router.route('/:id')
.put(protect, admin, updateAdmin)
.delete(protect, admin, deleteAdmin);

module.exports = router;  