const ash = require('express-async-handler');
const mongoose = require('mongoose');

const Post = require('../models/postModel');
const User = require('../models/userModel');

exports.get_all_posts = ash(async (req, res, next) => {
	if (process.env.CMS_CROSS_ORIGIN === req.headers.origin) {
		const posts = await Post.find({}).sort({ createdAt: -1 });
		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully retrieved posts'],
			errors: null,
			data: posts,
		});
	} else {
		const posts = await Post.find({ is_published: true }).sort({
			createdAt: -1,
		});
		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully retrieved posts'],
			errors: null,
			data: posts,
		});
	}
});

exports.get_post = ash(async (req, res, next) => {
	const { postId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['Post not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid Post id. Incorrect type.',
				},
			],
			data: null,
		});
	}

	const post = await Post.findById(postId);

	if (!post) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['Post not found'],
			errors: [
				{
					status: '404',
					detail: 'Provided id is not a valid post id. Incorrect type.',
				},
			],
			data: null,
		});
	}

	if (!post.is_published) {
		return res.json({
			status: 'error',
			code: 403,
			messages: ['Post not authorized'],
			errors: [
				{
					status: '403',
					detail: 'Can not view an unpublished post',
				},
			],
			data: null,
		});
	}

	res.status(200).json({
		status: 'ok',
		code: 200,
		messages: ['Successfully retrieved post'],
		errors: null,
		data: post,
	});
});

exports.create_post = ash(async (req, res, next) => {
	const { title, body } = req.body;
	const author = req.user._id;

	const emptyFields = [];
	if (!title) {
		emptyFields.push('body');
	}
	if (!body) {
		emptyFields.push('body');
	}
	if (emptyFields.length > 0) {
		return res
			.status(400)
			.json({ err: 'All fields are required', emptyFields });
	}

	try {
		const post = await Post.create({ title, body, author });
		await User.findByIdAndUpdate(
			author,
			{
				$push: { posts: post._id },
			},
			{ new: true }
		);
		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully created post'],
			errors: null,
			data: post,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error creating post'],
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

exports.delete_post = ash(async (req, res, next) => {
	const { postId } = req.params;
	const author = req.user._id;
	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['Post not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid post id. Incorrect type.',
				},
			],
			data: null,
		});
	}

	const post = await Post.findByIdAndDelete(postId);

	if (!post) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['Error deleting post'],
			errors: [
				{
					status: '404',
					detail: 'Post does not exist',
				},
			],
			data: null,
		});
	}
	try {
		await User.findByIdAndUpdate(
			author,
			{
				$pull: { posts: post._id },
			},
			{ new: true }
		);
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error deleting post from user'],
			errors: [
				{
					status: '400',
					detail: err.message,
				},
			],
			data: null,
		});
	}
	res.status(200).json({
		status: 'success',
		code: 200,
		messages: ['Post successfully deleted'],
		errors: null,
		data: post,
	});
});

exports.update_post = ash(async (req, res, next) => {
	const { postId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['Post not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid Post id. Incorrect type.',
				},
			],
			data: null,
		});
	}

	const post = await Post.findByIdAndUpdate(
		postId,
		{ ...req.body },
		{ new: true }
	);

	if (!post) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['Error updating post'],
			errors: [
				{
					status: '404',
					detail: 'The post was not found and can not be updated',
				},
			],
			data: null,
		});
	}

	res.status(200).json({
		status: 'ok',
		code: 200,
		messages: ['Successfully updated post'],
		errors: null,
		data: post,
	});
});
