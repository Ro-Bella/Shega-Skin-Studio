// backend/controllers/settingsController.js

/**
 * Generates time slots based on business hours.
 * In a real-world application, these settings would be stored in a database
 * and managed by an admin.
 *
 * @returns {string[]} An array of time slots in 'HH:mm' format.
 */
const generateTimeSlots = () => {
  const slots = [];
  const startTime = 9; // 9 AM
  const endTime = 17; // 5 PM (last slot starts at 5 PM)

  for (let hour = startTime; hour <= endTime; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    slots.push(time);
  }
  return slots;
};

// @desc    Get working hours configuration
// @route   GET /api/settings/working-hours
// @access  Public
exports.getWorkingHours = (req, res) => {
  const timeSlots = generateTimeSlots();
  res.status(200).json(timeSlots);
};