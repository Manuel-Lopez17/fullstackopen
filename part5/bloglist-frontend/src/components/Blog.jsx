import React from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const showDeleteButton = user && blog.user.username === user.username;
  return (
    <div>
      <h3>
        {blog.title} by {blog.author}
      </h3>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <p>
          {blog.likes} likes{' '}
          <button onClick={() => handleLike(blog)}>like</button>
        </p>
        <p>added by {blog.user.username}</p>
        {showDeleteButton && (
          <button onClick={() => handleRemove(blog)}>delete</button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
