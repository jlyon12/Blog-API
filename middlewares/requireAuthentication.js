const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuthentication = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		res.status(401).json({ err: 'Authorization Required' });
		return;
	}

	const token = authorization.split(' ')[1];

	try {
		const { _id } = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(_id).select('_id');
		next();
	} catch (err) {
		res.status(401).json({ err: 'Request not authorized' });
	}
};

module.exports = requireAuthentication;
