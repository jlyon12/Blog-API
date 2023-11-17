const express = require('express');
const router = express.Router({ mergeParams: true });
const upload = require('../middlewares/multer');
const requireAuthentication = require('../middlewares/requireAuthentication');
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
	requireAuthentication,
	requireAdmin,
	upload.single('img'),
	postValidationRules(),
	validate,
	postController.create_post
);

// Delete a post
router.delete(
	'/:postId',
	requireAuthentication,
	requireAdmin,
	postController.delete_post
);
// Update a post
router.patch(
	'/:postId',
	requireAuthentication,
	requireAdmin,
	upload.single('img'),
	postValidationPatchRules(),
	validate,
	postController.update_post
);

module.exports = router;
