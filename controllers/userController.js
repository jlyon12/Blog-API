const ash = require('express-async-handler');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Post = require('../models/postModel');

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

exports.signup = ash(async (req, res, next) => {
	// eslint-disable-next-line camelcase
	const { first_name, last_name, username, email, password } = req.body;

	try {
		const user = await User.signup(
			first_name,
			last_name,
			username,
			email,
			password
		);
		const token = createToken(user._id);
		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully signed up new user'],
			errors: [],
			data: { email, id: user._id, token },
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Could not signup'],
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

exports.login = ash(async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully logged in'],
			errors: [],
			data: { email, id: user._id, token },
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Could not log in'],
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

exports.loginAdmin = ash(async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.login(email, password);
		if (user.is_admin) {
			const token = createToken(user._id);
			res.status(200).json({
				status: 'ok',
				code: 200,
				messages: ['Successfully logged in'],
				errors: [],
				data: { email, id: user._id, token },
			});
		} else
			res.status(403).json({
				status: 'error',
				code: 403,
				messages: ['Not authorized'],
				errors: [
					{
						status: '403',
						detail: 'Only an administrator can access this page.',
					},
				],
				data: null,
			});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Could not login'],
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

exports.get_bookmarks = ash(async (req, res, next) => {
	const { userId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['User not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid User id. Incorrect type.',
				},
			],
			data: null,
		});
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['User not found'],
			errors: [
				{
					status: '404',
					detail: 'User does not exist',
				},
			],
			data: null,
		});
	}
	const bookmarks = await User.findById(userId).select('bookmarks');
	res.status(200).json({
		status: 'ok',
		code: 200,
		messages: ['Retrieved user bookmarks'],
		errors: null,
		data: bookmarks,
	});
});

exports.add_bookmark = ash(async (req, res, next) => {
	const { userId } = req.params;
	const { postId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['User not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid User id. Incorrect type.',
				},
			],
			data: null,
		});
	}
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

	const user = await User.findById(userId);
	const post = await Post.findById(postId);
	if (!user) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['User not found'],
			errors: [
				{
					status: '404',
					detail: 'User does not exist',
				},
			],
			data: null,
		});
	}
	if (!post) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['Post not found'],
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
		const bookmarkExists = await User.findOne(
			{
				_id: user.id,
				bookmarks: postId,
			},
			{ bookmarks$: postId }
		);

		if (bookmarkExists) throw Error('Bookmark already exists');
		await User.findByIdAndUpdate(
			userId,
			{
				$addToSet: { bookmarks: post },
			},
			{ new: true }
		);
		const newBookmark = await User.findOne(
			{
				_id: user.id,
				bookmarks: postId,
			},
			{ bookmarks$: postId }
		).select({ _id: 0 });

		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully added bookmark'],
			errors: null,
			data: newBookmark,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error adding bookmark'],
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
exports.delete_bookmark = ash(async (req, res, next) => {
	const { userId } = req.params;
	const { postId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['User not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid User id. Incorrect type.',
				},
			],
			data: null,
		});
	}
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

	const user = await User.findById(userId);
	const post = await Post.findById(postId);
	if (!user) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['User not found'],
			errors: [
				{
					status: '404',
					detail: 'User does not exist',
				},
			],
			data: null,
		});
	}
	if (!post) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['Post not found'],
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
		const bookmark = await User.findOne(
			{
				_id: user.id,
				bookmarks: postId,
			},
			{ bookmarks$: postId }
		);

		if (!bookmark) throw Error('Bookmark does not exist');
		await User.findByIdAndUpdate(
			userId,
			{
				$pull: { bookmarks: post._id },
			},
			{ new: true }
		);

		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully deleted bookmark'],
			errors: null,
			data: bookmark,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error deleting bookmark'],
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
exports.delete_bookmarks = ash(async (req, res, next) => {
	const { userId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(406).json({
			status: 'error',
			code: 406,
			messages: ['User not found'],
			errors: [
				{
					status: '406',
					detail: 'Provided id is not a valid User id. Incorrect type.',
				},
			],
			data: null,
		});
	}
	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({
			status: 'error',
			code: 404,
			messages: ['User not found'],
			errors: [
				{
					status: '404',
					detail: 'User does not exist',
				},
			],
			data: null,
		});
	}
	try {
		await User.findByIdAndUpdate(
			userId,
			{
				$set: { bookmarks: [] },
			},
			{ new: true }
		);
		const bookmarks = await User.findById(userId).select('bookmarks');

		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully deleted user bookmarks'],
			errors: null,
			data: bookmarks,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			code: 400,
			messages: ['Error deleting user bookmarks'],
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
