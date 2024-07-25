import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/blogs`;

let token = null;  // Variable to store the token

const setToken = newToken => {
  token = newToken;  // Set the token
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (id, updatedBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};

const remove = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};

export default {
  getAll,
  create,
  update,
  remove,
  setToken
};
