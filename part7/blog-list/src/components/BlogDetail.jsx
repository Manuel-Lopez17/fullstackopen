// components/BlogDetail.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';

const BlogDetail = () => {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getById(id),
  });

  const addCommentMutation = useMutation({
    mutationFn: () => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs', id]);
      setComment('');
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
    },
  });

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    addCommentMutation.mutate();
  };

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    likeBlogMutation.mutate({ id: blog.id, updatedBlog });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading blog</div>;
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </p>

      <p>{blog.likes} likes</p>
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogDetail;
