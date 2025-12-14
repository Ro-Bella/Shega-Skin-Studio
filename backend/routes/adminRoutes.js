// backend/routes/adminRoutes.js
const express = require('express');
const {
  authAdmin,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');
const { protect } = require('../controllers/authMiddleware'); // Import protect middleware

const router = express.Router();

router.post('/login', authAdmin);

router.route('/').post(protect, createAdmin).get(protect, getAdmins);
router.route('/:id').put(protect, updateAdmin).delete(protect, deleteAdmin);

module.exports = router;