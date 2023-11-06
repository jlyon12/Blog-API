const express = require('express');
const router = express.Router({ mergeParams: true });
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const {
	postValidationRules,
	postValidationPatchRules,
	validate,
} = require('../middlewares/validator');
const postController = require('../controllers/postController');

// Get all posts
router.get('/', postController.get_all_posts);
// Get single post
router.get('/:postId', postController.get_post);

// Create a new post
router.post(
	'/',
	requireAuth,
	requireAdmin,
	postValidationRules(),
	validate,
	postController.create_post
);

// Delete a post
router.delete(
	'/:postId',
	requireAuth,
	requireAdmin,
	postController.delete_post
);
// Update a post
router.patch(
	'/:postId',
	requireAuth,
	requireAdmin,
	postValidationPatchRules(),
	validate,
	postController.update_post
);

module.exports = router;
