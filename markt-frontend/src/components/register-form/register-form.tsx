import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterInputField } from "../input-field";
import { loginButtonStyles } from "../input-field/input-field.styles";
import { ErrorRsp } from "../../errorCodes";

// At the top of your RegisterForm component file (e.g., register-form.tsx)
const BASE_URL = process.env.NODE_ENV === 'test' ? 'http://localhost:5000' : 'https://project-1-web-application-design-group15.onrender.com';
const REGISTER_URL = `${BASE_URL}/api/user/register`;

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    form: "",
  });

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({
    fullName: false,
    email: false,
    password: false,
    phone: false,
  });

  console.log(touchedFields);

  const navigate = useNavigate();

  // Handle input changes and clear specific field errors on input
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" })); // Clear error on input change
    };

  // Handle onBlur for each input to show specific "required" error messages if empty
  const handleBlur = (fieldName: string, value: string) => {
    // Mark the field as touched
    setTouchedFields((prevTouched) => ({ ...prevTouched, [fieldName]: true }));

    // Show specific "required" error messages if the field is empty
    if (!value) {
      const fieldErrorMessages: { [key: string]: string } = {
        fullName: "Full Name is required",
        email: "A valid email is required",
        password: "Password is required",
        phone: "Phone number is required",
      };

      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: fieldErrorMessages[fieldName] || "This field is required",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          password,
          email,
          phone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful - redirecting to Login!");
        navigate("/login");
        setErrors({
          fullName: "",
          email: "",
          password: "",
          phone: "",
          form: "",
        });
      } else {
        console.error("Registration failed:", result);

        // Clear all field-specific errors before handling new ones
        const fieldErrors: { [key: string]: string } = {
          fullName: "",
          email: "",
          password: "",
          phone: "",
          form: "",
        };

        // Interpret backend error code and assign errors to respective fields
        switch (result.status) {
          case ErrorRsp.ERR_PARAM_DUP:
            fieldErrors.email = "User already exists!";
            break;
          case ErrorRsp.ERR_PARAM:
            if (Array.isArray(result.data)) {
              // Loop through array of validation errors and assign to respective fields
              result.data.forEach((error: string) => {
                if (error.toLowerCase().includes("email"))
                  fieldErrors.email = error;
                if (error.toLowerCase().includes("phone"))
                  fieldErrors.phone = error;
                if (error.toLowerCase().includes("password"))
                  fieldErrors.password = error;
                if (error.toLowerCase().includes("name"))
                  fieldErrors.fullName = error;
              });
            } else {
              fieldErrors.form = result.data;
            }
            break;
          default:
            fieldErrors.form =
              "An unexpected error occurred. Please try again later.";
            break;
        }
        setErrors(fieldErrors);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({
        ...errors,
        form: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <RegisterInputField
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={handleInputChange(setFullName, "fullName")}
        onBlur={() => handleBlur("fullName", fullName)}
      />
      {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}

      <RegisterInputField
        type="email"
        placeholder="UofT Email Address"
        value={email}
        onChange={handleInputChange(setEmail, "email")}
        onBlur={() => handleBlur("email", email)}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <RegisterInputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleInputChange(setPassword, "password")}
        onBlur={() => handleBlur("password", password)}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <RegisterInputField
        type="tel"
        placeholder="Phone No."
        value={phone}
        onChange={handleInputChange(setPhone, "phone")}
        onBlur={() => handleBlur("phone", phone)}
      />
      {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

      <button type="submit" style={loginButtonStyles}>
        Create Account
      </button>

      <div style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#000000" }}>
          <b>Sign In</b>
        </Link>
      </div>

      {/* General form error */}
      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
    </form>
  );
};

export { RegisterForm };
