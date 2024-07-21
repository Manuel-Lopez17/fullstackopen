import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Person from './models/person.js';

dotenv.config();

const app = express();

// const allowedOrigins = [
// 	'http://localhost:5173',
// 	'https://fullstackopenfrontend-manulopez17s-projects.vercel.app'
// ];

// app.use(cors({
// 	origin: (origin, callback) => {
// 		if (!origin || allowedOrigins.includes(origin)) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	}
// }));

app.use(cors())

app.use(express.json());
app.use(morgan('tiny'));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error('MONGODB_URI is not defined in .env file');
	process.exit(1);
}

mongoose.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then(persons => {
			res.json(persons);
		})
		.catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({ error: 'name or number missing' });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save()
		.then(savedPerson => {
			res.json(savedPerson);
		})
		.catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			if (result) {
				res.status(204).end();
			} else {
				res.status(404).json({ error: 'Person not found' });
			}
		})
		.catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			res.json(updatedPerson);
		})
		.catch(error => next(error));
});

app.get('/info', (req, res, next) => {
	Person.countDocuments({})
		.then(count => {
			const info = `
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `;
			res.send(info);
		})
		.catch(error => next(error));
});

// Error handling middleware should be after all routes
app.use((error, req, res, next) => {
	console.error(error.message);
	res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
