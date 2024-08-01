const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv');
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

// Load environment variables
const environment = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${environment}` });
console.log(`Running in ${process.env.NODE_ENV} mode`);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB');
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message);
	});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);


// Routers
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing');
	app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(PORT, () => {
	console.log(`listening to port ${PORT}`);
});

module.exports = app;
