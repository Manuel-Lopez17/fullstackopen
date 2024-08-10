import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';

const BlogForm = ({ setNotification, user }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      setNotification({
        message: `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        type: 'success',
      });
      setNewBlog({ title: '', author: '', url: '' });
    },
    onError: (error) => {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlogMutation.mutate({
      ...newBlog,
      userId: user.id, // Vincula el blog con el usuario autenticado
    });
  };

  const handleChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value });
  };

  const handleShow = () => {
    setShow(!show);
  };

  if (!show) {
    return <button onClick={handleShow}>New blog!</button>;
  }

  if (show) {
    return (
      <div>
        <h2>Create a new blog</h2>
        <form onSubmit={handleSubmit}>
          <div>
            title
            <input
              type="text"
              value={newBlog.title}
              name="title"
              onChange={handleChange}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={newBlog.author}
              name="author"
              onChange={handleChange}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={newBlog.url}
              name="url"
              onChange={handleChange}
            />
          </div>
          <button onClick={handleShow}>cancel</button>
          <button type="submit">create</button>
        </form>
      </div>
    );
  }
};

export default BlogForm;
