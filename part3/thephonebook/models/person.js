import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

const phoneNumberValidator = (number) => {
	const parts = number.split('-');
	if (parts.length !== 2) {
		return false;
	}
	if (!/^\d{2,3}$/.test(parts[0]) || !/^\d+$/.test(parts[1])) {
		return false;
	}
	return true;
};

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		minlength: 8,
		validate: {
			validator: phoneNumberValidator,
			message: props => `${props.value} is not a valid phone number!`
		},
		required: true
	}
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Person = mongoose.model('Person', personSchema);

export default Person;
