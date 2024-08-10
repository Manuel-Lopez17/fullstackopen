// components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {/* <Link to="/">Home</Link> */}
      <Link to="/users">Users</Link>
      <Link to="/blogs">Blogs</Link>
    </div>
  );
};

export default Navigation;
