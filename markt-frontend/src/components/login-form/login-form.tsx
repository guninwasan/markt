import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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

  // Validate the input field when it loses focus (onBlur event)
  const validateField = (name: string, value: string) => {
    const newErrors: { [key: string]: string } = { ...errors };

    if (name === 'email' && (!value)) {
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

    if (!email) newErrors.email = 'A valid email is required';

    setErrors(newErrors);

    // Dynamically enable/disable the button based on errors
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  }, [email, password]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Mark all fields as touched when submitting the form
    setTouchedFields({
      email: true,
      password: true,
    });
  
    if (Object.keys(errors).length === 0) {
      // No errors, proceed with login logic
      try {
        const response = await fetch('http://localhost:5000/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Login successful!");
        } else if (response.status === 404) {
          alert("Error: User not found!");
        } else if (response.status === 401) {
          alert("Error: Incorrect password!");
        } else {
          alert(`Error: ${result.data}`);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
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

      <div style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#000000' }}><b>Register</b></Link>
      </div>
    </form>
  );
};

export { LoginForm };