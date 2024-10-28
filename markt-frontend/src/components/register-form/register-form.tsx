import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { RegisterInputField } from '../input-field';
import { loginButtonStyles } from '../input-field/input-field.styles';

const RegisterForm: React.FC = () => {
  // State to handle all form inputs
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [studentID, setStudentID] = useState<string>('');

  // State to handle validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State to track if fields have been "touched" (blurred)
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    fullName: false,
    email: false,
    password: false,
    phone: false,
    studentID: false,
  });

  // Track whether the button should be disabled
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // Handle input changes
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setPhone(input);
  };
  const handleStudentIDChange = (e: React.ChangeEvent<HTMLInputElement>) => setStudentID(e.target.value);

  // Validate the input field when it loses focus (onBlur event)
  const validateField = (name: string, value: string) => {
    const newErrors: { [key: string]: string } = { ...errors };

    if (name === 'fullName' && !value) {
      newErrors.fullName = 'Full Name is required';
    } else if (name === 'email' && (!value)) {
      newErrors.email = 'A valid email is required';
    } else if (name === 'password' && (!value)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one special character';
    } else if (name === 'phone' && (!value || value.length !== 10)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    } else if (name === 'studentID' && !value) {
      newErrors.studentID = 'Student ID is required';
    } else {
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

    // To Do: Once backend is integrated, use the response codes to replace these error messages
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!email) newErrors.email = 'A valid UofT email ID is required';
    if (!password) newErrors.password = 'Password must be at least 8 characters long and contain at least one special character';
    if (!phone || phone.length !== 10) newErrors.phone = 'Phone number must be exactly 10 digits';
    if (!studentID) newErrors.studentID = 'Student ID is required';

    setErrors(newErrors);

    // Dynamically enable/disable the button based on errors
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  }, [fullName, email, password, phone, studentID]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched when submitting the form
    setTouchedFields({
      fullName: true,
      email: true,
      password: true,
      phone: true,
      studentID: true,
    });

    if (Object.keys(errors).length === 0) {
      // No errors, proceed with registration logic
      console.log('Registering with:', { fullName, email, password, phone, studentID });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RegisterInputField
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={handleFullNameChange}
        onBlur={() => { validateField('fullName', fullName); handleBlur('fullName'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.fullName && errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}

      <RegisterInputField
        type="email"
        placeholder="UofT Email Address"
        value={email}
        onChange={handleEmailChange}
        onBlur={() => { validateField('email', email); handleBlur('email'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.email && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <RegisterInputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={() => { validateField('password', password); handleBlur('password'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.password && errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <RegisterInputField
        type="tel"
        placeholder="Phone No."
        value={phone}
        onChange={handlePhoneChange}
        onBlur={() => { validateField('phone', phone); handleBlur('phone'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.phone && errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}

      <RegisterInputField
        type="text"
        placeholder="UofT Student ID (for verification)"
        value={studentID}
        onChange={handleStudentIDChange}
        onBlur={() => { validateField('studentID', studentID); handleBlur('studentID'); }} // Validate on blur and mark field as touched
      />
      {touchedFields.studentID && errors.studentID && <p style={{ color: 'red' }}>{errors.studentID}</p>}

      <button type="submit" style={loginButtonStyles} disabled={isButtonDisabled}>
        Create Account
      </button>

      <div style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#000000' }}><b>Sign In</b></Link>
      </div>

    </form>

    
  );
};

export { RegisterForm };