const User = require('../models/userModel');
const requireAdmin = async (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ err: 'Authorization Required' });
	}
	const user = await User.findById(req.user._id);
	if (!user.is_admin) {
		return res
			.status(403)
			.json({ err: 'Request denied. Invalid permissions.' });
	}

	next();
};

module.exports = requireAdmin;
