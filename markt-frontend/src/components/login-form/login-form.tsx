import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../input-field";
import { ErrorRsp } from "../../errorCodes";
import { setIsLoggedIn } from "../../redux";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/slices/user-auth-slice";
import { API_BASE_URL } from "../api";
import { LoginButton } from "./login-form.styles";
import { PasswordInput } from "../password-input";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({
    email: false,
    password: false,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const validateEmail = (email: string) =>
    /^[^\s@]+@(mail\.)?utoronto\.ca$/.test(email);

  const validateField = (name: string) => {
    const newErrors = { ...errors };
    if (name === "email") {
      newErrors.email =
        email && validateEmail(email) ? "" : "A valid UofT email is required";
    } else if (name === "password") {
      newErrors.password = password ? "" : "Password is required";
    }
    setErrors(newErrors);
  };

  useEffect(() => {
    setIsButtonDisabled(!(email && password));
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouchedFields({ email: true, password: true });
    validateField("email");
    validateField("password");

    if (!Object.values(errors).some((error) => error)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Login successful! Redirecting to Home...");
          dispatch(
            setUserDetails({
              userID: result.userID,
              name: result.name,
              email: result.email,
              phone: result.phone,
              jwt: result.token,
            })
          );

          dispatch(setIsLoggedIn(true));
          navigate("/"); // Redirect to home
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
        setErrors({
          form: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <InputField
        type="email"
        placeholder="Enter Your UofT Email Address"
        onChange={setEmail}
      />
      {touchedFields.email && errors.email && (
        <p style={{ color: "red" }}>{errors.email}</p>
      )}

      <PasswordInput
        onPasswordChange={setPassword}
        errorMessage={errors.password || ""}
        dontShowRequirements
        placeholder="Enter Your Password"
      />

      {touchedFields.password && errors.password && (
        <p style={{ color: "red" }}>{errors.password}</p>
      )}

      <LoginButton type="submit" disabled={isButtonDisabled}>
        Login
      </LoginButton>

      <div style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#000000" }}>
          <b>Register</b>
        </Link>
      </div>

      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
    </form>
  );
};

export { LoginForm };
