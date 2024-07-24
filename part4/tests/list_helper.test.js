const { describe, test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
	const blogs = []

	const result = listHelper.dummy(blogs)
	assert.strictEqual(result, 1)
})


describe('total likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0
		}
	]

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		assert.strictEqual(result, 5)
	})

	const listWithMultipleBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422b3a1b54a676234d17f9',
			title: 'Another Blog Post',
			author: 'Edsger W. Dijkstra',
			url: 'https://example.com/another',
			likes: 7,
			__v: 0
		},
		{
			_id: '5a422b891b54a676234d17fa',
			title: 'Yet Another Blog Post',
			author: 'Edsger W. Dijkstra',
			url: 'https://example.com/yetanother',
			likes: 3,
			__v: 0
		}
	]

	test('when list has multiple blogs, equals the sum of likes', () => {
		const result = listHelper.totalLikes(listWithMultipleBlogs)
		assert.strictEqual(result, 15)
	})

	test('when list is empty, equals zero', () => {
		const result = listHelper.totalLikes([])
		assert.strictEqual(result, 0)
	})
})

describe('most blogs', () => {
	const listWithMultipleBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422b3a1b54a676234d17f9',
			title: 'Another Blog Post',
			author: 'Robert C. Martin',
			url: 'https://example.com/another',
			likes: 7,
			__v: 0
		},
		{
			_id: '5a422b891b54a676234d17fa',
			title: 'Yet Another Blog Post',
			author: 'Edsger W. Dijkstra',
			url: 'https://example.com/yetanother',
			likes: 3,
			__v: 0
		},
		{
			_id: '5a422ba71b54a676234d17fb',
			title: 'Fourth Blog Post',
			author: 'Robert C. Martin',
			url: 'https://example.com/fourth',
			likes: 2,
			__v: 0
		},
		{
			_id: '5a422bc61b54a676234d17fc',
			title: 'Fifth Blog Post',
			author: 'Robert C. Martin',
			url: 'https://example.com/fifth',
			likes: 1,
			__v: 0
		}
	]

	test('author with most blogs', () => {
		const result = listHelper.mostBlogs(listWithMultipleBlogs)
		assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
	})

	test('when list is empty, equals null', () => {
		const result = listHelper.mostBlogs([])
		assert.strictEqual(result, null)
	})
})

describe('most likes', () => {
	const listWithMultipleBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422b3a1b54a676234d17f9',
			title: 'Another Blog Post',
			author: 'Robert C. Martin',
			url: 'https://example.com/another',
			likes: 7,
			__v: 0
		},
		{
			_id: '5a422b891b54a676234d17fa',
			title: 'Yet Another Blog Post',
			author: 'Edsger W. Dijkstra',
			url: 'https://example.com/yetanother',
			likes: 3,
			__v: 0
		},
		{
			_id: '5a422ba71b54a676234d17fb',
			title: 'Fourth Blog Post',
			author: 'Robert C. Martin',
			url: 'https://example.com/fourth',
			likes: 2,
			__v: 0
		},
		{
			_id: '5a422bc61b54a676234d17fc',
			title: 'Fifth Blog Post',
			author: 'Robert C. Martin',
			url: 'https://example.com/fifth',
			likes: 1,
			__v: 0
		}
	]

	test('author with most likes', () => {
		const result = listHelper.mostLikes(listWithMultipleBlogs)
		assert.deepStrictEqual(result, { author: 'Robert C. Martin', likes: 10 })
	})

	test('when list is empty, equals null', () => {
		const result = listHelper.mostLikes([])
		assert.strictEqual(result, null)
	})
})

