const Author = require('../models/author');
const Book = require('../models/book');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
	Query: {
		allBooks: async (root, args) => {
			let filter = {};

			if (args.genre) {
				filter.genres = { $in: [args.genre] };
			}

			return Book.find(filter).populate('author');
		},
		allAuthors: async () => {
			return Author.find({});
		},
		me: (root, args, context) => {
			return context.currentUser;
		},
	},
	Mutation: {
		addBook: async (root, args, context) => {
			if (!context.currentUser) {
				throw new GraphQLError('Authentication required', {
					extensions: { code: 'UNAUTHENTICATED' },
				});
			}

			try {
				// Find or create the author
				let author = await Author.findOne({ name: args.author });
				if (!author) {
					author = new Author({ name: args.author });
					await author.save();
				}

				const book = new Book({ ...args, author: author._id });
				await book.save();
				return book.populate('author');
			} catch (error) {
				throw new GraphQLError('Error adding book', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error,
					},
				});
			}
		},
		editAuthor: async (root, args, context) => {
			if (!context.currentUser) {
				throw new GraphQLError('Authentication required', {
					extensions: { code: 'UNAUTHENTICATED' },
				});
			}

			try {
				const author = await Author.findOne({ name: args.name });
				if (!author) {
					throw new GraphQLError('Author not found', {
						extensions: { code: 'NOT_FOUND' },
					});
				}

				author.born = args.setBornTo;
				await author.save();
				return author;
			} catch (error) {
				throw new GraphQLError('Error editing author', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error,
					},
				});
			}
		},
		createUser: async (root, args) => {
			const passwordHash = await bcrypt.hash('supersecret', 10); // Static password for simplicity
			const user = new User({ ...args });

			try {
				await user.save();
			} catch (error) {
				throw new GraphQLError('Creating user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error,
					},
				});
			}

			return user;
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'supersecret') {
				throw new GraphQLError('Invalid credentials', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
	},
};

module.exports = resolvers;
