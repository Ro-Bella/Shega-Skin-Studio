// backend/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Service type is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    durationMinutes: {
        type: Number,
        required: [true, 'Duration is required'],
    },
});

module.exports = mongoose.model('Service', serviceSchema);
