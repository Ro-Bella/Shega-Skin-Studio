// backend/routes/serviceRoutes.js
const express = require('express');
const {
  getServices,
  createService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Public route for getting services (for booking form)
router.get('/', getServices);

// Protected routes for managing services
router.route('/').post(protect, createService);
router.route('/:id').delete(protect, deleteService);

module.exports = router;