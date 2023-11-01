const User = require('../models/userModel');
const requireAdmin = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	if (!user.is_admin) {
		res.status(403).json({ err: 'Request denied. Invalid permissions.' });
	}

	next();
};

module.exports = requireAdmin;
