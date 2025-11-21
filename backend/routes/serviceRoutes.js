// backend/routes/serviceRoutes.js
const express = require('express');
const serviceController = require('../controllers/serviceController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/types', serviceController.getServicesByType); // አዲስ፡ የአገልግሎት አይነቶችን ለማምጣት
router.get('/by-type/:type', serviceController.getServicesByType); // አዲስ መስመር
router.get('/:id', serviceController.getServiceById);
router.post('/', protect, serviceController.createService);
router.put('/:id', protect, serviceController.updateService);
router.delete('/:id', protect, serviceController.deleteService);

module.exports = router;