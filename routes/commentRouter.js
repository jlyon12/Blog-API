const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
// Get all comments
router.get('/', commentController.get_post_comments);

// Get single comment
router.get('/:comment_id', commentController.get_single_post_comment);

// Create a new comment
router.post('/', commentController.create_comment);

// Delete a comment
router.delete('/:comment_id', commentController.delete_comment);

module.exports = router;
