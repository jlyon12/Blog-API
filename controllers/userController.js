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
		res.status(200).json({ email, token });
	} catch (err) {
		res.status(400).json({ err: err.message });
	}
});

exports.login = ash(async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.status(200).json({ email, token });
	} catch (err) {
		res.status(400).json({ err: err.message });
	}
});
