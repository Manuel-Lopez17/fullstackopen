const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return null
	return blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav)
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return null

	const authorCounts = blogs.reduce((counts, blog) => {
		counts[blog.author] = (counts[blog.author] || 0) + 1
		return counts
	}, {})

	const mostBloggedAuthor = Object.keys(authorCounts).reduce((a, b) => authorCounts[a] > authorCounts[b] ? a : b)
	return { author: mostBloggedAuthor, blogs: authorCounts[mostBloggedAuthor] }
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) return null

	const authorLikes = blogs.reduce((likes, blog) => {
		likes[blog.author] = (likes[blog.author] || 0) + blog.likes
		return likes
	}, {})

	const mostLikedAuthor = Object.keys(authorLikes).reduce((a, b) => authorLikes[a] > authorLikes[b] ? a : b)
	return { author: mostLikedAuthor, likes: authorLikes[mostLikedAuthor] }
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}