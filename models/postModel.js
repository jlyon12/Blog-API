const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		title: { type: String, required: true },
		body: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
		img: {
			url: { type: String, required: true },
			public_id: { type: String, required: true },
			src: { type: String, required: true },
			src_link: { type: String, required: true },
		},
		tags: [{ type: String }],
		is_published: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
