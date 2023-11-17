const express = require('express');
const router = express.Router({ mergeParams: true });
const requireAuthentication = require('../middlewares/requireAuthentication');
const requireAdmin = require('../middlewares/requireAdmin');
const {
	commentValidationRules,
	validate,
} = require('../middlewares/validator');

const commentController = require('../controllers/commentController');

// Get all comments
router.get('/', commentController.get_post_comments);
// Get single comment
router.get('/:commentId', commentController.get_single_post_comment);

// Create a new comment
router.post(
	'/',
	requireAuthentication,
	commentValidationRules(),
	validate,
	commentController.create_comment
);

// Delete a comment
router.delete(
	'/:commentId',
	requireAuthentication,
	requireAdmin,
	commentController.delete_comment
);

module.exports = router;
