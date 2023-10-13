require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Database connection
const connectDB = require('./config/db.js');
connectDB();

// Router
const router = require('./config/router');
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
