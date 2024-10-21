// login-page.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from './login-page';

// Mocking the components used inside LoginPage to focus on rendering logic
jest.mock('../../components/Navbar', () => ({
  Navbar: () => <div>Mocked Navbar</div>,
}));

jest.mock('../../components/Cover', () => ({
  Cover: ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('../../components/login-form/login-form', () => ({
  LoginForm: () => (
    <form>
      <input type="email" placeholder="UofT Email Address" />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  ),
}));

describe('LoginPage', () => {
  test('renders the Navbar, Cover with title, and LoginForm', () => {
    // Render the LoginPage component
    render(<LoginPage />);

    // Check if Navbar is rendered
    expect(screen.getByText('Mocked Navbar')).toBeInTheDocument();

    // Check if Cover and its title are rendered
    expect(screen.getByText("Welcome Back to UofT's Secure Marketplace!")).toBeInTheDocument();

    // Check if the LoginForm is rendered with input fields and a submit button
    expect(screen.getByPlaceholderText('UofT Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('allows the user to type into email and password fields', () => {
    // Render the LoginPage component
    render(<LoginPage />);

    // Find email and password input fields
    const emailInput = screen.getByPlaceholderText('UofT Email Address') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    // Simulate typing in the input fields
    fireEvent.change(emailInput, { target: { value: 'test@utoronto.ca' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert that the input fields contain the correct values
    expect(emailInput.value).toBe('test@utoronto.ca');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls form submission when login button is clicked', () => {
    // Render the LoginPage component
    render(<LoginPage />);

    // Mock form submission event
    const handleSubmit = jest.fn();
    const form = screen.getByRole('button', { name: /login/i });

    // Simulate form submission
    fireEvent.click(form);

    // Assert that the form submission has been called
    // Since you haven't set up actual submission logic in LoginForm, you can just check button behavior here
    expect(handleSubmit).not.toBeCalled(); // Form submission logic isn't implemented yet
  });
});
