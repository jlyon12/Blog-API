const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	userSignupValidationRules,
	userLoginValidationRules,
	userValidationPatchRules,
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
	'/:userId',
	requireAuthentication,
	requireAuthorization,
	userController.get_user_profile
);

router.patch(
	'/:userId',
	requireAuthentication,
	requireAuthorization,
	userValidationPatchRules(),
	validate,
	userController.update_user
);

router.delete(
	'/:userId',
	requireAuthentication,
	requireAuthorization,
	userController.delete_user
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
