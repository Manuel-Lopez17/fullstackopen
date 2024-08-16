import React from 'react';
import { useQuery } from '@apollo/client';
import { BOOKS_BY_FAVORITE_GENRE } from '../queries';

const FavoriteGenreBooks = ({ show }) => {
  const { loading, error, data } = useQuery(BOOKS_BY_FAVORITE_GENRE,{
		context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('user-token')}`,
      },
    }
	}
	);

  if (!show) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

	if(data.booksByFavoriteGenre.length == 0 ){
		return(<div><h2>No favorite books for this user</h2></div>)
	}

  return (
    <div>
      <h2>Books in your favorite genre</h2>
      <ul>
        {data.booksByFavoriteGenre.map((book) => (
          <li key={book.title}>
            {book.title} by {book.author.name}, published in {book.published}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteGenreBooks;
