const ash = require('express-async-handler');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.get_post_comments = ash(async (req, res, next) => {
	const { postId } = req.params;
	let { sort, page, pageSize } = req.query;
	const filter = [
		postId && { post: new mongoose.Types.ObjectId(postId) },
	].filter(Boolean);

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
	try {
		sort = parseInt(sort, 10) || -1;
		page = parseInt(page, 10) || 1;
		pageSize = parseInt(pageSize, 10) || 20;
		const comments = await Comment.aggregate([
			{
				$facet: {
					metadata: [
						{
							$match: {
								$and: filter,
							},
						},
						{ $count: 'totalCount' },
					],
					data: [
						{
							$match: {
								$and: filter,
							},
						},
						{
							$lookup: {
								from: 'users',
								localField: 'author',
								foreignField: '_id',
								as: 'author',
							},
						},
						{ $unwind: '$author' },
						{
							$project: {
								_id: 1,
								body: 1,
								author: {
									_id: '$author._id',
									username: '$author.username',
								},
								post: 1,
								createdAt: 1,
								updatedAt: 1,
							},
						},
						{ $sort: { createdAt: sort } },
						{ $skip: (page - 1) * pageSize },
						{ $limit: pageSize },
					],
				},
			},
		]);
		// If not docuements are found in aggregation - default total count to zeo to avoid error
		const totalCount = comments[0].metadata[0]
			? comments[0].metadata[0].totalCount
			: 0;

		res.status(200).json({
			status: 'ok',
			code: 200,
			messages: ['Successfully retrieved post comments'],
			errors: null,
			links: {
				prev:
					page > 1
						? `${process.env.SERVER_ORIGIN}/api/posts/${postId}/comments?page=${
								page - 1
						  }&pageSize=${pageSize}`
						: null,
				next:
					Math.ceil(page * pageSize) <= totalCount
						? `${process.env.SERVER_ORIGIN}/api/posts/${postId}/comments?page=${
								page + 1
						  }&pageSize=${pageSize}`
						: null,
			},
			metadata: {
				totalCount,
				page,
				pageSize,
				filter,
			},
			data: comments[0].data,
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			messages: ['Error retrieving post comments'],
			errors: [
				{
					status: '500',
					detail: err.message,
				},
			],
			data: null,
		});
	}
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
	let { postId, commentId, userId } = req.params;

	try {
		const comment = await Comment.findByIdAndDelete(commentId);
		if (userId) {
			postId = comment.post;
		}

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
