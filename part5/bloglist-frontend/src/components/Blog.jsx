import React from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const showDeleteButton = user && blog.user.username === user.username;

  return (
    <div>
      <h3>
        {blog.title} by {blog.author}
      </h3>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <p>
          {blog.likes} likes{" "}
          <button onClick={() => handleLike(blog)}>like</button>
        </p>
        <p>added by {blog.user.name}</p>
        {showDeleteButton && (
          <button onClick={() => handleDelete(blog)}>delete</button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default Blog;
