// backend/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
    },
    email: {
        type: String,
        required: [true, 'Client email is required'],
        unique: true,
        lowercase: true,
    },
    phone: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Client', clientSchema);
