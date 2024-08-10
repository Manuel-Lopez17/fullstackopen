import React, { useState } from 'react';
import userService from '../services/user';

const RegistrationForm = ({ setNotification }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const newUser = {
        username,
        name,
        password,
      };
      await userService.register(newUser);
      setUsername('');
      setName('');
      setPassword('');
      setNotification({ message: 'Registration successful', type: 'success' });
    } catch (exception) {
      setNotification({ message: 'Registration failed', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Name
        <input
          type="text"
          value={name}
          name="Name"
          onChange={({ target }) => setName(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
