import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;

const register = async newUser => {
	const response = await axios.post(baseUrl, newUser);
	return response.data;
};

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const getById = async (id) => {
	const response = await axios.get(`${baseUrl}/${id}`);
	return response.data;
};

export default { register, getAll, getById };
