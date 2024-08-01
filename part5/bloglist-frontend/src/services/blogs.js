import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/blogs`;
const user = window.localStorage.getItem('loggedBlogappUser');

let token = null;  // Variable to store the token

if (user) {
  token = user.token;
}

const setToken = newToken => {
  token = newToken;  // Set the token
};

console.log('token: ', token);

const getAll = async () => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return response.data;
};

const remove = async (id) => {
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
