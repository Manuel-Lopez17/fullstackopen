const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // ajusta el path si es necesario
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
	{
		title: 'First blog post',
		author: 'Author One',
		url: 'http://example.com/1',
		likes: 1
	},
	{
		title: 'Second blog post',
		author: 'Author Two',
		url: 'http://example.com/2',
		likes: 2
	}
]

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
	const response = await api.get('/api/blogs')
	response.body.forEach(blog => {
		expect(blog.id).toBeDefined()
	})
})

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'New blog post',
		author: 'New Author',
		url: 'http://example.com/3',
		likes: 3
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')
	const titles = response.body.map(r => r.title)
	expect(response.body).toHaveLength(initialBlogs.length + 1)
	expect(titles).toContain('New blog post')
})

test('blog without likes defaults to 0', async () => {
	const newBlog = {
		title: 'Blog without likes',
		author: 'Author Without Likes',
		url: 'http://example.com/4'
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')
	const addedBlog = response.body.find(blog => blog.title === 'Blog without likes')
	expect(addedBlog.likes).toBe(0)
})

test('blog without title and url is not added', async () => {
	const newBlog = {
		author: 'Author Without Title and URL',
		likes: 5
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(400)

	const response = await api.get('/api/blogs')
	expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(async () => {
	await mongoose.connection.close()
})
