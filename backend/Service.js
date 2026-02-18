const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  duration: { type: String }, // e.g., "30 mins", "1 hour"
  image: { type: String }, // URL for the service image
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);