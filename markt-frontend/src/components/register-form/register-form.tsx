import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterInputField } from '../input-field';
import { loginButtonStyles } from '../input-field/input-field.styles';
import { ErrorRsp } from '../../errorCodes';

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [studentID, setStudentID] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    fullName: false,
    email: false,
    password: false,
    phone: false,
    studentID: false,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const navigate = useNavigate();

  // Validation functions for each field
  const validatePassword = (password: string) => /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
  const validateEmail = (email: string) => /^[^\s@]+@(mail\.)?utoronto\.ca$/.test(email);

  // Handle input changes and clear specific field errors on change
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' })); // Clear the error for this field
  };

  // Mark a field as "touched" when it loses focus and validate
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
    validateField(fieldName); // Validate on blur
  };

  // Validate a single field based on its name
  const validateField = (name: string) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'fullName':
        newErrors.fullName = fullName ? '' : 'Full Name is required';
        break;
      case 'email':
        newErrors.email = email && validateEmail(email) ? '' : 'A valid UofT email is required';
        break;
      case 'password':
        newErrors.password = password && validatePassword(password) ? '' : 'Password must be at least 8 characters long and contain at least one special character';
        break;
      case 'phone':
        newErrors.phone = phone && phone.length === 10 ? '' : 'Phone number must be exactly 10 digits';
        break;
      case 'studentID':
        newErrors.studentID = studentID ? '' : 'Student ID is required';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Enable/disable the submit button based on form completeness
  useEffect(() => {
    setIsButtonDisabled(!(fullName && email && password && phone && studentID));
  }, [fullName, email, password, phone, studentID]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched when submitting the form
    setTouchedFields({
      fullName: true,
      email: true,
      password: true,
      phone: true,
      studentID: true,
    });

    // Validate all fields on submit
    validateField('fullName');
    validateField('email');
    validateField('password');
    validateField('phone');
    validateField('studentID');

    // Only submit if there are no client-side validation errors
    if (!Object.values(errors).some((error) => error)) {
      try {
        const response = await fetch('http://localhost:5000/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            utorid: studentID,
            password,
            email,
            phone,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Registration successful - redirecting to Login!");
          navigate('/login');
          setErrors({}); // Clear errors on successful registration
        } else {
          console.error("Registration failed:", result);
          // Interpret backend error code and set appropriate field error
          switch (result.status) {
            case ErrorRsp.ERR_PARAM_DUP:
              setErrors({ email: result.data });
              break;
            case ErrorRsp.ERR_PARAM_EMAIL:
              setErrors({ email: result.data });
              break;
            case ErrorRsp.ERR_PARAM_PWD:
              setErrors({ password: result.data });
              break;
            case ErrorRsp.ERR_PARAM_PHONE:
              setErrors({ phone: result.data });
              break;
            case ErrorRsp.ERR_PARAM:
              setErrors({ form: "Some parameters are missing or invalid." });
              break;
            default:
              setErrors({ form: "An unexpected error occurred. Please try again later." });
              break;
          }
        }
      } catch (error) {
        console.error("Registration failed:", error);
        setErrors({ form: "An unexpected error occurred. Please try again later." });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RegisterInputField
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={handleInputChange(setFullName, 'fullName')}
        onBlur={() => handleBlur('fullName')}
        style={{ borderColor: errors.fullName ? 'red' : undefined }}
      />
      {touchedFields.fullName && errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}

      <RegisterInputField
        type="email"
        placeholder="UofT Email Address"
        value={email}
        onChange={handleInputChange(setEmail, 'email')}
        onBlur={() => handleBlur('email')}
        style={{ borderColor: errors.email ? 'red' : undefined }}
      />
      {touchedFields.email && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <RegisterInputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleInputChange(setPassword, 'password')}
        onBlur={() => handleBlur('password')}
        style={{ borderColor: errors.password ? 'red' : undefined }}
      />
      {touchedFields.password && errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <RegisterInputField
        type="tel"
        placeholder="Phone No."
        value={phone}
        onChange={handleInputChange(setPhone, 'phone')}
        onBlur={() => handleBlur('phone')}
        style={{ borderColor: errors.phone ? 'red' : undefined }}
      />
      {touchedFields.phone && errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}

      <RegisterInputField
        type="text"
        placeholder="UofT Student ID (for verification)"
        value={studentID}
        onChange={handleInputChange(setStudentID, 'studentID')}
        onBlur={() => handleBlur('studentID')}
        style={{ borderColor: errors.studentID ? 'red' : undefined }}
      />
      {touchedFields.studentID && errors.studentID && <p style={{ color: 'red' }}>{errors.studentID}</p>}

      <button type="submit" style={loginButtonStyles} disabled={isButtonDisabled}>
        Create Account
      </button>

      <div style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#000000' }}><b>Sign In</b></Link>
      </div>

      {/* General form error */}
      {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
    </form>
  );
};

export { RegisterForm };
