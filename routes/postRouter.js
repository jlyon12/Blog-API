const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
// Get all posts
router.get('/', postController.get_all_posts);

// Get single post
router.get('/:id', postController.get_post);

// Create a new post
router.post('/', postController.create_post);

// Delete a post
router.delete('/:id', postController.delete_post);

// Update a post
router.patch('/:id', postController.update_post);

module.exports = router;
