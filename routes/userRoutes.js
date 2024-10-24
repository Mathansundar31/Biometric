const express = require('express');
const router = express.Router();
const userController = require('../controller/userController'); // Check this path

// Define routes
router.post('/biometric', userController.registerUser);
router.post('/attendance', userController.recordAttendance);

module.exports = router;
