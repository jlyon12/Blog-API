const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const postController = require('../controllers/postController');

// Get all posts
router.get('/', postController.get_all_posts);
// Get single post
router.get('/:id', postController.get_post);

// Protect routes below
router.use(requireAuth);
router.use(requireAdmin);
// Create a new post
router.post('/', postController.create_post);
// Delete a post
router.delete('/:id', postController.delete_post);
// Update a post
router.patch('/:id', postController.update_post);

module.exports = router;
