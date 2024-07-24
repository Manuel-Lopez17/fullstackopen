const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body

	if (!body.title || !body.url) {
		return response.status(400).json({ error: 'title or url missing' })
	}

	const blog = new Blog(body)
	const savedBlog = await blog.save()
	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	const deletedBlog = await Blog.findByIdAndDelete(id)

	if (!deletedBlog) {
		return response.status(404).json({ error: 'blog not found' })
	}

	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body
	const id = request.params.id

	const updatedBlog = await Blog.findByIdAndUpdate(
		id,
		{ likes: body.likes },
		{ new: true, runValidators: true, context: 'query' }
	)

	if (!updatedBlog) {
		return response.status(404).json({ error: 'blog not found' })
	}

	response.json(updatedBlog)
})

module.exports = blogsRouter
