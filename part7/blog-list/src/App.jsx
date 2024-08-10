import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import blogService from './services/blogs';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import BlogDetail from './components/BlogDetail';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './components/Users';
import User from './components/User';

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <Navigation />
          <Notification
            message={notification.message}
            type={notification.type}
          />

          {user === null ? (
            <div>
              {showRegister ? (
                <RegistrationForm setNotification={setNotification} />
              ) : (
                <LoginForm
                  setUser={setUser}
                  setNotification={setNotification}
                />
              )}
              <button onClick={() => setShowRegister(!showRegister)}>
                {showRegister
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </button>
            </div>
          ) : (
            <div>
              <p>
                {user.name} logged in{' '}
                <button onClick={handleLogout}>Logout</button>
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <h2>Blogs</h2>
                <BlogForm setNotification={setNotification} user={user} />
              </div>

              <Routes>
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
              </Routes>
            </div>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
