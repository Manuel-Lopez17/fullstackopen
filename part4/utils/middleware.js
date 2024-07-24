const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).json({ error: 'malformatted id' })
	}

	next(error)
}

module.exports = {
	errorHandler
}
