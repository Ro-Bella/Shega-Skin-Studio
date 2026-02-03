// backend/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'የአገልግሎቱ ስም መሞላት አለበት።'],
    unique: true,
  },
});

module.exports = mongoose.model('Service', serviceSchema);