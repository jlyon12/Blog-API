/* eslint-disable camelcase */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	},
	{ timestamps: true }
);

UserSchema.statics.signup = async function (
	first_name,
	last_name,
	username,
	email,
	password
) {
	const emailExists = await this.findOne({ email });
	const usernameExists = await this.findOne({ username });

	if (!first_name || !last_name || !username || !email || !password) {
		throw Error('All fields are required');
	}

	if (!validator.isEmail(email)) {
		throw Error('Email must be a valid email');
	}

	if (!validator.isStrongPassword(password)) {
		throw Error(
			'Password must be at least 8 characters long and include at least one lowercase, uppercase, number and symbol'
		);
	}

	if (emailExists) {
		throw Error('This email is already registered');
	}

	if (usernameExists) {
		throw Error('This username is taken');
	}

	const salt = await bcrypt.genSalt(15);
	const hash = await bcrypt.hash(password, salt);
	const user = await this.create({
		first_name,
		last_name,
		username,
		email,
		password: hash,
	});

	return user;
};
UserSchema.statics.login = async function (email, password) {
	if (!email || !password) {
		throw Error('All fields are required');
	}

	const user = await this.findOne({ email });

	if (!user) {
		throw Error('Incorrect email');
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw Error('Incorrect password');
	}

	return user;
};

module.exports = mongoose.model('User', UserSchema);
