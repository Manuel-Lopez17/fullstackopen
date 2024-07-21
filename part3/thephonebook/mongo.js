import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.mjs <password>');
	process.exit(1);
}

const password = process.argv[2];
const url = process.env.MONGODB_URI.replace('<password>', password);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		console.log('phonebook:');
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
} else if (process.argv.length === 5) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then(() => {
		console.log(`added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
	});
} else {
	console.log('Please provide the name and number as arguments: node mongo.mjs <password> <name> <number>');
	process.exit(1);
}