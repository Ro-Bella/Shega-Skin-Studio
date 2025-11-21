// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'የደንበኛ ስም ያስፈልጋል'],
  },

  email: {
    type: String,
    required: [true, 'የኢሜይል አድራሻ ያስፈልጋል'],
  },
  
  phone: {
    type: String,
    required: [true, 'የስልክ ቁጥር ያስፈልጋል'],
  },

  service: {
    type: String,
    required: [true, 'የተፈለገው አገልግሎት ያስፈልጋል'],
  },
  date: {
    type: Date,
    required: [true, 'የቀጠሮ ቀን ያስፈልጋል'],
  },
  time: {
    type: String,
    required: [true, 'የቀጠሮ ሰዓት ያስፈልጋል'],
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);