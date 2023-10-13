const express = require('express');
const router = express.Router();

const postRouter = require('../routes/postRouter');

router.use('/api/posts', postRouter);

module.exports = router;
