// src/services/personService.js
const baseUrl = `${import.meta.env.VITE_API_URL
	}/api/persons`;

// Ensure the environment variable is defined
if (!import.meta.env.VITE_API_URL
) {
	console.error("REACT_APP_API_URL is not defined!");
}

const getAll = () => {
	return fetch(baseUrl).then(response => response.json());
};

const create = (newPerson) => {
	return fetch(baseUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newPerson),
	}).then(response => response.json());
};

const update = (id, updatedPerson) => {
	return fetch(`${baseUrl}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedPerson),
	}).then(response => response.json());
};

const remove = (id) => {
	return fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
	}).then(response => response.json());
};

export default { getAll, create, update, remove };
