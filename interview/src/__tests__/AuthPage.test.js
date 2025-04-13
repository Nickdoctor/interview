// AuthPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthPage from '../Pages/AuthPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../Utils/auth.js', () => ({
  signUp: jest.fn().mockResolvedValue({}),
  logIn: jest.fn().mockResolvedValue({}),
  logOut: jest.fn().mockResolvedValue({ success: true }),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('renders login form', () => {
  renderWithRouter(<AuthPage />);
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
});

test('allows switching to Sign Up form', () => {
  renderWithRouter(<AuthPage />);
  const toggleButton = screen.getByRole('button', { name: /sign up/i });
  fireEvent.click(toggleButton);
  expect(screen.getByText(/create account/i)).toBeInTheDocument();
});
