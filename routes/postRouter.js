const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

const postController = require('../controllers/postController');

// Get public posts
router.get('/published', postController.get_published_posts);
// Get single post
router.get('/:id', postController.get_post);

// Protect routes below
router.use(requireAuth);

// Get all posts
router.get('/', postController.get_all_posts);
// Create a new post
router.post('/', postController.create_post);
// Delete a post
router.delete('/:id', postController.delete_post);
// Update a post
router.patch('/:id', postController.update_post);

module.exports = router;
