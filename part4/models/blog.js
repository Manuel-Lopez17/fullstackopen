const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	likes: {
		type: Number,
		default: 0
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;

		if (returnedObject.user && returnedObject.user._id) {
			returnedObject.user = {
				username: returnedObject.user.username,
				id: returnedObject.user._id.toString()
			};
		}
	}
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

