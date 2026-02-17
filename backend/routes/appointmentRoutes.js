// backend/routes/appointmentRoutes.js
const express = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Public route for creating appointments
router.post('/', createAppointment);

// Protected routes for managing appointments (Admin Dashboard)
router.route('/').get(protect, getAppointments);
router.route('/:id').put(protect, updateAppointment).delete(protect, deleteAppointment);

router.put('/:id/confirm', protect, confirmAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;