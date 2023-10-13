const express = require('express');
const router = express.Router();

const indexRouter = require('../routes/indexRouter');

router.use('/api', indexRouter);

module.exports = router;
