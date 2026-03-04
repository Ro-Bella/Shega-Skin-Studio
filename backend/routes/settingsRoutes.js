// backend/routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const { getWorkingHours } = require('../controllers/settingsController');

// @route   GET /api/settings/working-hours
router.get('/working-hours', getWorkingHours);

module.exports = router;