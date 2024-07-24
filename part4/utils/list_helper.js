const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return null;

	const authors = blogs.reduce((acc, blog) => {
		acc[blog.author] = acc[blog.author] ? acc[blog.author] + 1 : 1;
		return acc;
	}, {});

	const author = Object.keys(authors).reduce((a, b) => (authors[a] > authors[b] ? a : b));
	return { author, blogs: authors[author] };
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) return null;

	const authors = blogs.reduce((acc, blog) => {
		acc[blog.author] = acc[blog.author] ? acc[blog.author] + blog.likes : blog.likes;
		return acc;
	}, {});

	const author = Object.keys(authors).reduce((a, b) => (authors[a] > authors[b] ? a : b));
	return { author, likes: authors[author] };
};

module.exports = {
	dummy,
	totalLikes,
	mostBlogs,
	mostLikes
};
