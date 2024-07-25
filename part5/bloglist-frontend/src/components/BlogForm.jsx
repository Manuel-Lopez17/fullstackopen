// src/components/BlogForm.js

import React, { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ setBlogs }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    try {
      await blogService.create(newBlog);
      const blogs = await blogService.getAll();
      setBlogs(blogs);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      console.error("Failed to add blog");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
