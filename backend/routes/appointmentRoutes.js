const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  cancelAppointment,
  getBookedSlots,
} = require('../controllers/appointmentController');

// @route   GET /api/appointments/booked-slots
// ይህ ራውት ከ '/:id' በፊት መገለጽ አለበት፤ ምክንያቱም 'booked-slots' እንደ ID እንዳይቆጠር
router.route('/booked-slots').get(getBookedSlots);

// @route   POST /api/appointments
// @route   GET /api/appointments
router.route('/')
  .post(createAppointment)
  .get(getAppointments);

// @route   PUT /api/appointments/:id
// @route   DELETE /api/appointments/:id
router.route('/:id')
  .put(updateAppointment)
  .delete(deleteAppointment);

// @route   PUT /api/appointments/:id/confirm
router.route('/:id/confirm').put(confirmAppointment);

// @route   PUT /api/appointments/:id/cancel
router.route('/:id/cancel').put(cancelAppointment);

module.exports = router;