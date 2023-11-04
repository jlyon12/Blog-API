const ash = require('express-async-handler');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.get_post_comments = ash(async (req, res, next) => {
	const { postId } = req.params;
	const { limit, skip, sort } = req.query;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(404).json({ msg: 'Post not found.' });
	}
	const comments = await Comment.find({
		post: postId,
	})
		.sort({ createdAt: sort })
		.limit(limit)
		.skip(skip)
		.populate('author post', 'username title');

	res.status(200).json(comments);
});

exports.get_single_post_comment = ash(async (req, res, next) => {
	const { postId, commentId } = req.params;

	if (
		!mongoose.Types.ObjectId.isValid(commentId) ||
		!mongoose.Types.ObjectId.isValid(postId)
	) {
		return res.status(404).json({ msg: 'Comment not found' });
	}

	const post = await Post.findById(postId);
	const comment = await Comment.findById(commentId);

	if (!comment) {
		return res.status(404).json({ msg: 'Comment not found' });
	}
	if (!post.is_published) {
		return res
			.status(403)
			.json({ msg: 'Comment not authorized. Post is unpublished' });
	}

	res.status(200).json(comment);
});

exports.create_comment = ash(async (req, res, next) => {
	const { body } = req.body;
	const { postId } = req.params;
	const author = req.user._id;
	try {
		const comment = await Comment.create({
			body,
			author,
			post: postId,
		});

		await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: comment._id },
			},
			{ new: true }
		);
		await User.findByIdAndUpdate(
			author,
			{
				$push: { comments: comment._id },
			},
			{ new: true }
		);
		res.status(200).json(comment);
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
});

exports.delete_comment = ash(async (req, res, next) => {
	const { postId, commentId } = req.params;
	try {
		const comment = await Comment.findByIdAndDelete(commentId);
		await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { comments: commentId },
			},
			{ new: true }
		);
		await User.findByIdAndUpdate(
			comment.author,
			{
				$pull: { comments: commentId },
			},
			{ new: true }
		);
		res.status(200).json(comment);
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
});
