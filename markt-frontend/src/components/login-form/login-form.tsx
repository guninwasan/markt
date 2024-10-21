// LoginForm.tsx
import React, { useState } from 'react';
import { InputField } from '../input-field';
import { loginButtonStyles } from '../input-field/input-field.styles';

const LoginForm: React.FC = () => {
  // State to handle email and password inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here (e.g., API calls)
    console.log('Logging in with:', { email, password });
  };

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <InputField type="email" placeholder="UofT Email Address" />
      <InputField type="password" placeholder="Password" />
      <button type="submit" style={loginButtonStyles}>
        Login
      </button>
    </form>
  );
};

export { LoginForm };