import axios from "axios";
const baseURL = "http://localhost:3001/api/persons"
// const baseURL = "https://fullstackopenbackend-manulopez17s-projects.vercel.app/api/persons"

const getAll = () => {
	const request = axios.get(baseURL)
	return request.then(response => response.data)
}

const create = newObject => {
	const request = axios.post(baseURL, newObject)
	return request.then(response => response.data)
}

const update = (id, newObject) => {
	const request = axios.put(`${baseURL}/${id}`, newObject)
	return request.then(response => response.data)
}

const deleteUser = (id) => {
	const request = axios.delete(`${baseURL}/${id}`)
	return request.then(response => response.data)
}

export default { getAll, create, update, deleteUser }