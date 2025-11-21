// backend/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup); // አዲስ ተጠቃሚ ለመመዝገብ

// ከዚህ በታች ያሉት ራውቶች ጥበቃ ያስፈልጋቸዋል (በኋላ እንጨምራለን)
// router.use(authController.protect); 

// ለተጠቃሚ-ተኮር ተግባራት
router.get('/me', authController.protect, userController.getMe);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


// ለአስተዳዳሪ ብቻ የሚሆኑ ራውቶች (በኋላ እንጨምራለን)
// router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
