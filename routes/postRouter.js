const express = require('express');
const router = express.Router();

// Get all posts
router.get('/', (req, res, next) => {
	res.json({ msg: 'Get all Posts' });
});
// Get single post
router.get('/:id', (req, res, next) => {
	res.json({ msg: 'Get Single Post' });
});

// Create a new post
router.post('/', (req, res, next) => {
	res.json({ msg: 'Create new post' });
});

// Delete a post
router.delete('/:id', (req, res, next) => {
	res.json({ msg: 'Delete post' });
});

// Update a post
router.patch('/:id', (req, res, next) => {
	res.json({ msg: 'Update new post' });
});

module.exports = router;
