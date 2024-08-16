import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../queries';

const CreateUserForm = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [createUser] = useMutation(CREATE_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
		console.log(username, favoriteGenre, password)

    try {
      await createUser({
        variables: { username, favoriteGenre, password }
      });
      setUsername('');
      setPassword('');
      setFavoriteGenre('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // if (!show) {
  //   return null;
  // }
	

  return (
    <div>
      <h2>Create a new account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <button type="button" onClick={handleShowPassword}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>
        </div>
        <div>
          Favorite Genre
          <input
            value={favoriteGenre}
            onChange={({ target }) => setFavoriteGenre(target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

    </div>
  );
};

export default CreateUserForm;
