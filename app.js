require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();

app.use(logger('dev'));
app.use(express.json());

// Database connection
const connectDB = require('./config/db.js');
connectDB();

// Helmet configuration
const helmet = require('helmet');
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				'script-src': ["'self'", "'unsafe-inline'"],
				'connect-src': ["'self'"],
			},
		},
	})
);

// Cors configuration
const corsOptions = {
	origin: [process.env.CMS_CROSS_ORIGIN, process.env.CLIENT_CROSS_ORIGIN],
};

app.use(cors(corsOptions));

// Rate Limit configuration
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
	windowMs: 1 * 60 * 1000,
	max: 200,
});
app.use(limiter);

// Compress routes
const router = require('./config/router');
const compression = require('compression');
app.use(compression());
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({ err: err.message });
});

module.exports = app;
