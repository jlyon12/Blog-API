const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
