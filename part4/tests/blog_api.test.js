const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../index')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
	{
		title: 'First Blog',
		author: 'Author1',
		url: 'http://firstblog.com',
		likes: 1
	},
	{
		title: 'Second Blog',
		author: 'Author2',
		url: 'http://secondblog.com',
		likes: 2
	}
]

beforeEach(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash('sekret', 10)
	const user = new User({ username: 'root', passwordHash })
	await user.save()

	for (let blog of initialBlogs) {
		let blogObject = new Blog({ ...blog, user: user._id })
		await blogObject.save()
	}
})

describe('when there is initially some blogs saved', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(initialBlogs.length)
	})

	test('a specific blog is within the returned blogs', async () => {
		const response = await api.get('/api/blogs')
		const titles = response.body.map(r => r.title)
		expect(titles).toContain('First Blog')
	})
})

describe('addition of a new blog', () => {
	let token

	beforeEach(async () => {
		const loginResponse = await api
			.post('/api/login')
			.send({
				username: 'root',
				password: 'sekret',
			})
		token = loginResponse.body.token
	})

	test('a valid blog can be added', async () => {
		const newBlog = {
			title: 'New Blog',
			author: 'Author',
			url: 'http://newblog.com',
			likes: 5,
		}

		const user = await User.findOne({ username: 'root' })

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...newBlog, userId: user.id })
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		const titles = response.body.map(r => r.title)
		expect(titles).toContain('New Blog')
	})

	test('blog without likes defaults to 0', async () => {
		const newBlog = {
			title: 'Blog without likes',
			author: 'Author',
			url: 'http://nolikesblog.com'
		}

		const user = await User.findOne({ username: 'root' })

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...newBlog, userId: user.id })
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		const addedBlog = response.body.find(blog => blog.title === 'Blog without likes')
		expect(addedBlog.likes).toBe(0)
	})

	test('blog without title and url is not added', async () => {
		const newBlog = {
			author: 'Author',
			likes: 5
		}

		const user = await User.findOne({ username: 'root' })

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...newBlog, userId: user.id })
			.expect(400)

		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(initialBlogs.length)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
