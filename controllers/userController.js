const ash = require('express-async-handler');

exports.signup = ash(async (req, res, next) => {
	res.json({ msg: 'Signup User' });
});

exports.login = ash(async (req, res, next) => {
	res.json({ msg: 'Login user' });
});
