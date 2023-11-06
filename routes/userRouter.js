const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	userSignupValidationRules,
	userLoginValidationRules,
	validate,
} = require('../middlewares/validator');

const userController = require('../controllers/userController');

// Signup user
router.post(
	'/signup',
	userSignupValidationRules(),
	validate,
	userController.signup
);

// Login user
router.post(
	'/login',
	userLoginValidationRules(),
	validate,
	userController.login
);

// Login admin
router.post(
	'/login/admin',
	userLoginValidationRules(),
	validate,
	userController.loginAdmin
);
module.exports = router;
