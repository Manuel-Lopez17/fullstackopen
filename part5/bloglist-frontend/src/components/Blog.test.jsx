import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import Blog from './Blog';

test('calls event handler twice when the like button is clicked twice', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} handleLike={mockHandler} />);

  const showButton = screen.getByText('show');
  fireEvent.click(showButton);

  const likeButton = screen.getByText('like');
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
