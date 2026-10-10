// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST endpoints
router.post('/register', authController.registerCustomer);
router.post('/login', authController.loginUser);

module.exports = router;