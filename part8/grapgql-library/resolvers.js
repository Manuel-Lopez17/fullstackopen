const { v4: uuid } = require('uuid');
const { books, authors } = require('./data');

const resolvers = {
	Query: {
		bookCount: () => books.length,
		authorCount: () => authors.length,
		allBooks: (root, args) => {
			let filteredBooks = books;
			if (args.author) {
				filteredBooks = filteredBooks.filter(book => book.author === args.author);
			}
			if (args.genre) {
				filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
			}
			return filteredBooks;
		},
		allAuthors: () => authors.map(author => ({
			...author,
			bookCount: books.filter(book => book.author === author.name).length,
		})),
	},
	Mutation: {
		addBook: (root, args) => {
			const book = { ...args, id: uuid() };
			books.push(book);

			if (!authors.find(author => author.name === args.author)) {
				authors.push({ name: args.author, id: uuid() });
			}

			return book;
		},
		editAuthor: (root, args) => {
			const author = authors.find(a => a.name === args.name);
			if (!author) return null;

			author.born = args.setBornTo;
			return author;
		},
	},
};

module.exports = resolvers;
