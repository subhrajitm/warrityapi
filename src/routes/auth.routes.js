const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');
const { validate, userValidationRules } = require('../middleware/validation.middleware');

// Register a new user
router.post('/register', userValidationRules.register, validate, authController.register);

// Login user
router.post('/login', userValidationRules.login, validate, authController.login);

// Get current user profile
router.get('/me', auth, authController.getCurrentUser);

// Change password
router.post('/change-password', auth, authController.changePassword);

module.exports = router; 