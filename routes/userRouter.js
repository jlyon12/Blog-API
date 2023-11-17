const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	userSignupValidationRules,
	userLoginValidationRules,
	validate,
} = require('../middlewares/validator');
const requireAuthentication = require('../middlewares/requireAuthentication');
const requireAuthorization = require('../middlewares/requireAuthorization');
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

router.get(
	'/:userId/bookmarks',
	requireAuthentication,
	requireAuthorization,
	userController.get_bookmarks
);
router.post(
	'/:userId/bookmarks',
	requireAuthentication,
	requireAuthorization,
	userController.add_bookmark
);
router.patch(
	'/:userId/bookmarks',
	requireAuthentication,
	requireAuthorization,
	userController.delete_bookmark
);
router.delete(
	'/:userId/bookmarks',
	requireAuthentication,
	requireAuthorization,
	userController.delete_bookmarks
);

module.exports = router;
