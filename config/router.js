const express = require('express');
const router = express.Router({ mergeParams: true });
const userRouter = require('../routes/userRouter');
const postRouter = require('../routes/postRouter');
const commentRouter = require('../routes/commentRouter');

router.use('/api/user', userRouter);
router.use('/api/posts', postRouter);
router.use('/api/posts/:postId/comments', commentRouter);

module.exports = router;
