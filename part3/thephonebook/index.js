import express from "express";
import morgan from "morgan";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors())
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body", {
		skip: (req) => req.method !== "POST",
	})
);
app.use(morgan("tiny"));

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((person) => person.id === id);

	if (person) {
		res.json(person);
	} else {
		res.status(404).send({ error: "Person not found" });
	}
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const personIndex = persons.findIndex((person) => person.id === id);

	if (personIndex !== -1) {
		persons.splice(personIndex, 1);
		res.status(204).end();
	} else {
		res.status(404).send({ error: "Person not found" });
	}
});

app.post("/api/persons", (req, res) => {
	const { name, number } = req.body;

	if (!name || !number) {
		return res.status(400).json({ error: "Name or number is missing" });
	}

	if (persons.find((person) => person.name === name)) {
		return res.status(400).json({ error: "Name must be unique" });
	}

	const newPerson = {
		id: Math.floor(Math.random() * 1000000),
		name,
		number,
	};

	persons.push(newPerson);
	res.status(201).json(newPerson);
});

app.put("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const { name, number } = req.body;

	const personIndex = persons.findIndex((person) => person.id === id);

	if (personIndex !== -1) {
		const updatedPerson = { ...persons[personIndex], name, number };
		persons[personIndex] = updatedPerson;
		res.json(updatedPerson);
	} else {
		res.status(404).send({ error: "Person not found" });
	}
});

app.get("/info", (req, res) => {
	const requestTime = new Date();
	const responseText = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${requestTime}</p>
  `;

	res.send(responseText);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});