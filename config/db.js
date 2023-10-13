const mongoose = require('mongoose');
const debug = require('debug')('blog-api:database');

const connectDB = async () => {
	const uri = process.env.MONGO_URI;
	try {
		mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (err) {
		debug(err.message);
		process.exit(1);
	}
	const connection = mongoose.connection;

	connection.once('open', () => {
		debug(`Database connected: ${uri}`);
	});
	connection.on('error', (err) => {
		debug(`Connection error: ${err.message}`);
	});
};

module.exports = connectDB;
