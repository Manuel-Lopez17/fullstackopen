import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
	name: 'blogs',
	initialState: [],
	reducers: {
		setBlogs (state, action) {
			return action.payload;
		},
		appendBlog (state, action) {
			state.push(action.payload);
		},
		updateBlog (state, action) {
			const updatedBlog = action.payload;
			return state.map(blog => (blog.id !== updatedBlog.id ? blog : updatedBlog));
		},
		removeBlog (state, action) {
			const id = action.payload;
			return state.filter(blog => blog.id !== id);
		},
	},
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
	return async dispatch => {
		const blogs = await blogService.getAll();
		dispatch(setBlogs(blogs));
	};
};

export const createBlog = newBlog => {
	return async dispatch => {
		const createdBlog = await blogService.create(newBlog);
		dispatch(appendBlog(createdBlog));
	};
};

export const likeBlog = id => {
	return async dispatch => {
		const blogs = await blogService.getAll();
		const blogToLike = blogs.find(blog => blog.id === id);
		const updatedBlog = { ...blogToLike, likes: blogToLike.likes + 1 };

		const returnedBlog = await blogService.update(id, updatedBlog);
		dispatch(updateBlog(returnedBlog));
	};
};

export const deleteBlog = id => {
	return async dispatch => {
		await blogService.remove(id);
		dispatch(removeBlog(id));
	};
};

export default blogSlice.reducer;
