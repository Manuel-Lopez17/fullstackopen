import React,{useState} from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = ({show}) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const books = data.allBooks;
  const genres = [...new Set(books.flatMap(book => book.genres))];
   const filteredBooks = selectedGenre
    ? books.filter(book => book.genres.includes(selectedGenre))
    : books;

  return (
    <div>
      <h2>Books</h2>
            <div>
              <button onClick={() => setSelectedGenre(null)}>All genres</button>
        {genres.map(genre => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
    </div>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author name</th>
            <th>Author born</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.author.born}</td>
              <td>{book.published}</td>
              <td>{book.genres.map( g => g + " ").concat()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
  );
};

export default Books;
