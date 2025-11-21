// routes/appointments.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController'); // ዱካው ትክክል መሆኑን እናረጋግጣለን
const { protect } = require('../controllers/authController'); // protect middleware እናስገባለን
const { body, validationResult } = require('express-validator');
const { get } = require('mongoose');

// Validation middleware for creating appointments
const validateAppointment = [
  // የግብዣ መረጃዎችን ማረጋገጫ
  body('client').notEmpty().withMessage('Client ID is required.'),
  body('service').notEmpty().withMessage('Service ID is required.'),
  body('date').isISO8601().withMessage('Valid date is required.'),
  body('startTime').matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// @route   GET /api/appointments
// @desc    Get all appointments / ሁሉንም ቀጠሮዎች አምጣ
// አስተዳዳሪ ብቻ እንዲያያቸው በ protect middleware እንጠብቀዋለን
router.get('/', protect, appointmentController.getAllAppointments);


// @route   POST /api/appointments
// @desc    Book a new appointment / አዲስ ቀጠሮ አስያዝ
// Use protect + validation middleware, then delegate to controller
router.post('/', protect, validateAppointment, appointmentController.createAppointment);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID / ቀጠሮን በ ID አምጣ
// አስተዳዳሪ ብቻ እንዲያያቸው በ protect middleware እንጠብቀዋለን
router.get('/:id', protect, appointmentController.getAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment / ቀጠሮ አሰርዝ
// አስተዳዳሪ ብቻ እንዲያያቸው በ protect middleware እንጠብቀዋለን
router.delete('/:id', protect, appointmentController.deleteAppointment);
module.exports = router;