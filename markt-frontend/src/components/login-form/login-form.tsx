import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginInputField } from '../input-field';
import { loginButtonStyles } from '../input-field/input-field.styles';
import { ErrorRsp } from '../../errorCodes';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // Validation function
  const validateEmail = (email: string) => /^[^\s@]+@(mail\.)?utoronto\.ca$/.test(email);

  // Handle input changes and clear specific field errors on change
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
  };

  // Mark a field as "touched" when it loses focus
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
    validateField(fieldName); // Validate on blur
  };

  // Validate a single field
  const validateField = (name: string) => {
    const newErrors = { ...errors };
    if (name === 'email') {
      newErrors.email = email && validateEmail(email) ? '' : 'A valid UofT email is required';
    } else if (name === 'password') {
      newErrors.password = password ? '' : 'Password is required';
    }
    setErrors(newErrors);
  };

  // Enable/disable the submit button based on form completeness
  useEffect(() => {
    setIsButtonDisabled(!(email && password));
  }, [email, password]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    setTouchedFields({ email: true, password: true });
    validateField('email');
    validateField('password');

    // Only submit if there are no client-side validation errors
    if (!Object.values(errors).some((error) => error)) {
      try {
        const response = await fetch('http://localhost:5000/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Login successful! Redirecting to Home...");
          navigate('/'); // Redirect to home
        } else {
          // Handle specific backend errors
          switch (result.status) {
            case ErrorRsp.ERR_NOT_FOUND:
              setErrors({ email: "User does not exist" });
              break;
            case ErrorRsp.ERR_PARAM:
              setErrors({ password: "Incorrect password" });
              break;
            default:
              setErrors({ form: "An error occurred. Please try again later." });
              break;
          }
        }
      } catch (error) {
        console.error("Login failed:", error);
        setErrors({ form: "An unexpected error occurred. Please try again later." });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <LoginInputField
        type="email"
        placeholder="UofT Email Address"
        value={email}
        onChange={handleInputChange(setEmail, 'email')}
        onBlur={() => handleBlur('email')}
        style={{ borderColor: errors.email ? 'red' : undefined }}
      />
      {touchedFields.email && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <LoginInputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleInputChange(setPassword, 'password')}
        onBlur={() => handleBlur('password')}
        style={{ borderColor: errors.password ? 'red' : undefined }}
      />
      {touchedFields.password && errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <button type="submit" style={loginButtonStyles} disabled={isButtonDisabled}>
        Login
      </button>

      <div style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#000000' }}><b>Register</b></Link>
      </div>

      {/* General form error */}
      {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
    </form>
  );
};

export { LoginForm };
