const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.json({ msg: 'Welcome to the API!' });
});

module.exports = router;
