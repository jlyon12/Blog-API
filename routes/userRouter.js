const express = require('express');
const router = express.Router({ mergeParams: true });

const userController = require('../controllers/userController');

// Signup user
router.post('/signup', userController.signup);

// Login user
router.post('/login', userController.login);

// Login admin
router.post('/login/admin', userController.loginAdmin);
module.exports = router;
