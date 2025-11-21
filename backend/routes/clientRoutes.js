// backend/routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

router.get('/by-email/:email', clientController.findClientByEmail);
router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients); // አማራጭ: ሁሉንም ደንበኞች ለማግኘት

module.exports = router;
