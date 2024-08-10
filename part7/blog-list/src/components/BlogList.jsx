import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import blogService from '../services/blogs';

const BlogList = () => {
  const {
    data: blogs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            <h3>{blog.title}</h3>
          </Link>
          <p>{blog.author}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
