import { useState } from 'react';
import { useQuery } from '@apollo/client';
import LoginForm from './components/LoginFrom';
import CreateUserForm from './components/CreateUser';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import FavoriteGenreBooks from './components/FavoriteGenresBook';
import { ALL_AUTHORS, ALL_BOOKS } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const [token, setToken] = useState(localStorage.getItem('user-token'));


  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  if (!token) {
    return (
    <>
      <LoginForm setToken={setToken} />
      <CreateUserForm  />
    </>)
  }


  const handlePage =  (page) => {
    setPage(page)
  }

  const handleLogout = () => {
    localStorage.removeItem("user-token")
    setToken(null)
  }

  if(token){
    return (
      <div>
        <div>
          <button type='button' onClick={() => handlePage('authors')}>authors</button>
          <button type='button' onClick={() => handlePage('books')}>books</button>
          <button type='button' onClick={() => handlePage('add')}>add book</button>
          <button type='button' onClick={() => handlePage('favorite-gender')}>favorite gender</button>
          <button type='button' onClick={() => handleLogout()}>Logout</button>
        </div>
  
        <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} />
  
        <Books show={page === 'books'} />
  
        <NewBook show={page === 'add'} />

        <FavoriteGenreBooks show={page === "favorite-gender"}/>
      </div>
    );
  }
};

export default App;
