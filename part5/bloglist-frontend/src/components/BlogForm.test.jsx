import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

test('calls the event handler with the correct details when a new blog is created', () => {
  const createBlog = jest.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText('title');
  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');
  const createButton = screen.getByText('create');

  fireEvent.change(titleInput, { target: { value: 'Test Blog' } });
  fireEvent.change(authorInput, { target: { value: 'Test Author' } });
  fireEvent.change(urlInput, { target: { value: 'http://testblog.com' } });
  fireEvent.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
  });
});
