        // backend/routes/adminregistrationRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for admin registration (protected, only existing admins can register new ones)
router.post('/register-admin', authController.protect, authController.restrictTo('admin'), authController.registerAdmin);
const userController = require('../controllers/userController');

// Route for getting all users (protected, only admins can access)
router.get('/users', authController.protect, authController.restrictTo('admin'), userController.getAllUsers);
const reportController = require('../controllers/reportController');
 
try {
        const result = await someAsyncOperation();
        console.log('Operation successful:', result);
    } catch (error) {
        console.error('Error during operation:', error);
    }
// Route for generating reports (protected, only admins can access)
router.get('/reports', authController.protect, authController.restrictTo('admin'), reportController.generateReport);
const settingsController = require('../controllers/settingsController');

try {     const result = await someAsyncOperation();
        console.log('Operation successful:', result);
    } catch (error) {
        console.error('Error during operation:', error);
    }  

  
try {
        const result = await someAsyncOperation();
        console.log('Operation successful:', result);
    } catch (error) {
        console.error('Error during operation:', error);
    }

// Route for updating system settings (protected, only admins can access)
router.put('/settings', authController.protect, authController.restrictTo('admin'), settingsController.updateSettings);
const auditController = require('../controllers/auditController');

// Route for viewing audit logs (protected, only admins can access)
router.get('/audit-logs', authController.protect, authController.restrictTo('admin'), auditController.viewAuditLogs);
module.exports = router;
