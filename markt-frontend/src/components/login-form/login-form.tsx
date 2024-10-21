import React, { useState, useEffect } from 'react';
import { LoginInputField } from '../input-field';
import { loginButtonStyles } from '../input-field/input-field.styles';

const LoginForm: React.FC = () => {
  // State to handle email and password inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // State to handle validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State to track if fields have been "touched" (blurred)
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });

  // Track whether the button should be disabled
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  // Helper function to validate email format with "utoronto.ca" or "mail.utoronto.ca"
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@(mail\.)?utoronto\.ca$/;
    return emailRegex.test(email);
  };

  // Validate the input field when it loses focus (onBlur event)
  const validateField = (name: string, value: string) => {
    const newErrors: { [key: string]: string } = { ...errors };

    if (name === 'email' && (!value || !validateEmail(value))) {
      newErrors.email = 'A valid email is required';
    }
    else {
      delete newErrors[name]; // Remove the error if the field is valid
    }

    setErrors(newErrors);
  };

  // Mark a field as "touched" when it loses focus
  const handleBlur = (name: string) => {
    setTouchedFields((prevState) => ({
      ...prevState,
      [name]: true,
    }));
  };

  // Validate the entire form whenever any input changes and update the button state
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (!email || !validateEmail(email)) newErrors.email = 'A valid email is required';

    setErrors(newErrors);

    // Dynamically enable/disable the button based on errors
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  }, [email, password]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched when submitting the form
    setTouchedFields({
      email: true,
      password: true,
    });

    if (Object.keys(errors).length === 0) {
      // No errors, proceed with login logic
      console.log('Logging in with:', { email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <LoginInputField
        type="email"
        placeholder="UofT Email Address"
        value={email}
        onChange={handleEmailChange}
        onBlur={() => { validateField('email', email); handleBlur('email'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.email && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <LoginInputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={() => { validateField('password', password); handleBlur('password'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.password && errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <button type="submit" style={loginButtonStyles} disabled={isButtonDisabled}>
        Login
      </button>
    </form>
  );
};

export { LoginForm };
