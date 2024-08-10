import React from 'react';

const Blog = ({ blog }) => (
  <div>
    <h3>{blog.title}</h3>
    <p>Author: {blog.author}</p>
    <p>URL: {blog.url}</p>
  </div>
);

export default Blog;
