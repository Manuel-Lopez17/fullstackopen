const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	} else {
		request.token = null
	}
	next()
}

const userExtractor = async (request, response, next) => {
	const token = request.token
	if (token) {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (decodedToken.id) {
			request.user = await User.findById(decodedToken.id)
		}
	} else {
		request.user = null
	}
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid token' })
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({ error: 'token expired' })
	}

	next(error)
}

module.exports = {
	tokenExtractor,
	userExtractor,
	unknownEndpoint,
	errorHandler
}
