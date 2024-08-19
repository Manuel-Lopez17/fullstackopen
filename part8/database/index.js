const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const typeDefs = require('./schema/index');
const resolvers = require('./resolvers/index');
const User = require('./models/user');

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI


mongoose.connect(MONGODB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((error) => console.error('Error connecting to MongoDB:', error.message));

const startServer = async () => {
	const app = express();
	app.use(cors());
	app.use(bodyParser.json());

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			const auth = req ? req.headers.authorization : null;
			if (auth && auth.startsWith('Bearer ')) {
				const token = auth.substring(7);
				try {
					const decodedToken = jwt.verify(token, JWT_SECRET);
					const currentUser = await User.findById(decodedToken.id);
					return { currentUser };
				} catch (err) {
					console.error('JWT verification failed:', err);
				}
			}
			return { currentUser: null };
		},
	});

	await server.start();

	server.applyMiddleware({
		app,
		path: '/',
	});

	app.listen({ port: 4000 }, () =>
		console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
	);
};

startServer();
