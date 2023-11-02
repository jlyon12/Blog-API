const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
	{
		body: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
