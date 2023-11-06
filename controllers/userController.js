const ash = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
			data: { email, token },
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
			data: { email, token },
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
				data: { email, token },
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
