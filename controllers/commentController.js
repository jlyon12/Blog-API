const ash = require('express-async-handler');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.get_post_comments = ash(async (req, res, next) => {
	const { postId } = req.params;
	const { limit, skip, sort } = req.query;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['Comments can not be retrieved'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid post id. Incorrect type.',
				},
			],
			data: null,
		});
	}
	const comments = await Comment.find({
		post: postId,
	})
		.sort({ createdAt: sort })
		.limit(limit)
		.skip(skip)
		.populate('author post', 'username title');

	res.status(200).json({
		status: 'ok',
		code: 200,
		messages: ['Successfully retrieved comments for post'],
		errors: null,
		data: comments,
	});
});

exports.get_single_post_comment = ash(async (req, res, next) => {
	const { postId, commentId } = req.params;

	if (
		!mongoose.Types.ObjectId.isValid(commentId) ||
		!mongoose.Types.ObjectId.isValid(postId)
	) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['Comment not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid id. Incorrect type.',
				},
			],
			data: null,
		});
	}

	const post = await Post.findById(postId);
	const comment = await Comment.findById(commentId);

	if (!comment) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['Comment not found'],
			errors: [
				{
					status: '404',
					detail: 'Comment does not exist',
				},
			],
			data: null,
		});
	}
	if (!post.is_published) {
		return res.status(403).json({
			status: 'error',
			code: 403,
			messages: ['Comment not authorized'],
			errors: [
				{
					status: '403',
					detail: 'Can not view comments of an unpublished post ',
				},
			],
			data: null,
		});
	}

	res.status(200).json({
		status: 'ok',
		code: 200,
		messages: ['Successfully retrieved comments for post'],
		errors: null,
		data: comment,
	});
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
		res.status(200).json({
			status: 'success',
			code: 200,
			messages: ['Comment successfully created'],
			errors: null,
			data: comment,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error creating comment'],
			errors: [
				{
					status: '400',
					detail: err.message,
				},
			],
			data: null,
		});
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
		res.status(200).json({
			status: 'success',
			code: 200,
			messages: ['Comment successfully deleted'],
			errors: null,
			data: comment,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error deleting comment'],
			errors: [
				{
					status: '400',
					detail: err.message,
				},
			],
			data: null,
		});
	}
});
