import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = data.allBooks;

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
