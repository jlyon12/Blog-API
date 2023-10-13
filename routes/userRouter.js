const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Signup user
router.post('/signup', userController.signup);

// Login user
router.post('/login', userController.login);

module.exports = router;
