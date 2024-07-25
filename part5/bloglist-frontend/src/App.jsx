// src/App.js

import React, { useState, useEffect } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    console.log(loggedUserJSON);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      fetchBlogs();
    } catch (exception) {
      setNotification("Wrong username or password");
      setNotificationType("error");
      setTimeout(() => {
        setNotification(null);
        setNotificationType("");
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setNotification("Logged out successfully");
    setNotificationType("info");
    setTimeout(() => {
      setNotification(null);
      setNotificationType("");
    }, 5000);
  };

  const handleBlogCreation = async (newBlog) => {
    try {
      await blogService.create(newBlog);
      const blogs = await blogService.getAll();
      setBlogs(blogs);
      setNotification("Blog added successfully");
      setNotificationType("info");
    } catch (exception) {
      setNotification("Failed to add blog");
      setNotificationType("error");
    }
    setTimeout(() => {
      setNotification(null);
      setNotificationType("");
    }, 5000);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Notification message={notification} type={notificationType} />
      <BlogForm handleBlogCreation={handleBlogCreation} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
