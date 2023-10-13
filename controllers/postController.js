const ash = require('express-async-handler');

exports.get_all_posts = ash(async (req, res, next) => {
	res.json({ msg: 'Get all Posts' });
});

exports.get_post = ash(async (req, res, next) => {
	res.json({ msg: 'Get Single Post' });
});

exports.create_post = ash(async (req, res, next) => {
	res.json({ msg: 'Create new post' });
});

exports.delete_post = ash(async (req, res, next) => {
	res.json({ msg: 'Delete post' });
});

exports.update_post = ash(async (req, res, next) => {
	res.json({ msg: 'Update new post' });
});
