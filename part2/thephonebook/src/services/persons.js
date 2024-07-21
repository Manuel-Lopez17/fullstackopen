import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/persons`;

// Ensure the environment variable is defined
if (!import.meta.env.VITE_API_URL) {
	console.error("VITE_API_URL is not defined!");
}

const getAll = () => {
	return axios.get(baseUrl).then(response => response.data);
};

const create = (newPerson) => {
	return axios.post(baseUrl, newPerson).then(response => response.data);
};

const update = (id, updatedPerson) => {
	return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data);
};

const remove = (id) => {
	return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
};

export default { getAll, create, update, remove };
