const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // We'll need this for settings

// Public Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected Routes (User must be logged in)
router.post('/settings', authMiddleware, userController.updateSettings);

module.exports = router;