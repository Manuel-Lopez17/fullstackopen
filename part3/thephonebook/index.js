import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Person from './models/person.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();


const errorHandler = (error, req, res, next) => {
	console.error(error.message);

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).json({ error: 'malformatted id' });
	}

	next(error);
};



app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(errorHandler);


if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.mjs <password>');
	process.exit(1);
}

const password = process.argv[2];
const url = process.env.MONGODB_URI.replace('<password>', password);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons);
	});
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

app.post('/api/persons', (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({ error: 'name or number missing' });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then(savedPerson => {
		res.json(savedPerson);
	});
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
