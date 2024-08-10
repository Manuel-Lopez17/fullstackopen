const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User, Blog } = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config()


const app = express();
const PORT = process.env.SECRET && 3001;
const SECRET = process.env.SECRET

app.use(cors());
app.use(bodyParser.json());

// Middleware to extract token
const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.substring(7);
	}
	next();
};

// Middleware to extract user from token
const userExtractor = async (req, res, next) => {
	if (req.token) {
		const decodedToken = jwt.verify(req.token, SECRET);
		if (decodedToken.id) {
			req.user = await User.findByPk(decodedToken.id);
		}
	}
	next();
};

// Routes

// Register User
app.post('/api/users', async (req, res) => {
	const { username, password, name } = req.body;
	const passwordHash = await bcrypt.hash(password, 10);

	const user = await User.create({ username, passwordHash, name });
	res.status(201).json(user);
});

// Login User
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ where: { username } });
	const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({ error: 'invalid username or password' });
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	};

	const token = jwt.sign(userForToken, SECRET);

	res.status(200).send({ token, username: user.username, name: user.name });
});

// Obtener todos los usuarios y la cantidad de blogs creados
app.get('/api/users', async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Blog,
			attributes: []
		},
		attributes: {
			include: [
				[sequelize.fn('COUNT', sequelize.col('blogs.id')), 'blogsCount']
			]
		},
		group: ['User.id']
	});
	res.json(users);
});

// Obtener un usuario por su ID junto con sus blogs
app.get('/api/users/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id, {
		include: {
			model: Blog
		}
	});

	if (!user) {
		return res.status(404).json({ error: 'user not found' });
	}

	res.json(user);
});

// Get All Blogs
app.get('/api/blogs', async (req, res) => {
	const blogs = await Blog.findAll({ include: User });
	res.json(blogs);
});

// Get blog by id

app.get('/api/blogs/:id', async (req, res) => {

	try {
		const blog = await Blog.findByPk(req.params.id, {
			include: User,  // Include the associated user
		});

		if (blog) {
			res.json(blog);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: 'something went wrong...' });
	}
});

// Create a Blog
app.post('/api/blogs', tokenExtractor, userExtractor, async (req, res) => {
	const body = req.body;

	if (!req.user) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}

	const blog = await Blog.create({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		userId: req.user.id,
	});

	res.status(201).json(blog);
});

// Like a Blog
app.put('/api/blogs/:id', async (req, res) => {
	const { id } = req.params;
	const { likes } = req.body;

	const blog = await Blog.findByPk(id);
	if (!blog) {
		return res.status(404).json({ error: 'blog not found' });
	}

	blog.likes = likes;
	await blog.save();

	res.json(blog);
});

// Agregar comentario a un blog
app.post('/api/blogs/:id/comments', async (req, res) => {
	const { id } = req.params;
	const { comment } = req.body;

	const blog = await Blog.findByPk(id);
	if (!blog) {
		return res.status(404).json({ error: 'blog not found' });
	}

	const updatedComments = [...blog.comments, comment];
	blog.comments = updatedComments;
	await blog.save();

	res.status(201).json(blog);
});


// Delete a Blog
app.delete('/api/blogs/:id', tokenExtractor, userExtractor, async (req, res) => {
	const { id } = req.params;

	const blog = await Blog.findByPk(id);
	if (!blog) {
		return res.status(404).json({ error: 'blog not found' });
	}

	if (blog.userId !== req.user.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	await blog.destroy();
	res.status(204).end();
});

// Start Server
app.listen(PORT, async () => {
	console.log(`Server running on port ${PORT}`);
	await sequelize.sync({ force: true });
	console.log('Database synced');
});
