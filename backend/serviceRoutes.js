const express = require('express');
const router = express.Router();
const { getServices, addService, deleteService } = require('../controllers/serviceController');

router.route('/').get(getServices).post(addService);
router.route('/:id').delete(deleteService);

module.exports = router;