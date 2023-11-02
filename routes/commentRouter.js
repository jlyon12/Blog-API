const express = require('express');
const router = express.Router({ mergeParams: true });
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const commentController = require('../controllers/commentController');

// Get all comments
router.get('/', commentController.get_post_comments);
// Get single comment
router.get('/:commentId', commentController.get_single_post_comment);

// Create a new comment
router.post('/', requireAuth, commentController.create_comment);

// Delete a comment
router.delete(
	'/:commentId',
	requireAuth,
	requireAdmin,
	commentController.delete_comment
);

module.exports = router;
