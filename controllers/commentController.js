const ash = require('express-async-handler');

exports.get_post_comments = ash(async (req, res, next) => {
	res.json({ msg: 'Get comments for post' });
});

exports.get_single_post_comment = ash(async (req, res, next) => {
	res.json({ msg: 'Get single comment on post' });
});

exports.create_comment = ash(async (req, res, next) => {
	res.json({ msg: 'Post comment' });
});

exports.delete_comment = ash(async (req, res, next) => {
	res.json({ msg: 'Delete Comment' });
});
