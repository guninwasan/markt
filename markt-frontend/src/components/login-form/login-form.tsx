import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../input-field";
import { ErrorRsp } from "../../errorCodes";
import { setIsLoggedIn } from "../../redux";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/slices/user-auth-slice";
import { API_BASE_URL } from "../api";
import {
  LoginButton,
  FormContainer,
  ErrorText,
  LinkText,
  LinkStyled,
} from "./login-form.styles";
import { PasswordInput } from "../password-input";
import { passwordCheck } from "../../utils/password-check";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const standardErrorMessage =
    "This email and password combination doesn't exist in our records. Please try again.";

  const validateEmail = (email: string) =>
    /^[^\s@]+@(mail\.)?utoronto\.ca$/.test(email);

  useEffect(() => {
    setIsButtonDisabled(!email || !password);
  }, [email, password, errors]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const validationCheck = (email: string, password: string) => {
    const newErrors: { [key: string]: string } = {};

    if (!password) {
      newErrors.password = "Please enter a password.";
    }

    if (!email) {
      newErrors.email = "Please enter a valid UofT email.";
    }

    if (
      (!passwordCheck(password) && email) ||
      (!validateEmail(email) && password && email)
    ) {
      // we can also load here for a couple of seconds
      newErrors.form = standardErrorMessage;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validationCheck(email, password);

    const checkErrors = Object.values(errors).some((error) => error);

    if (checkErrors || !email || !password) {
      return;
    }

    if (!checkErrors) {
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
          const newErrors = { ...errors };
          switch (result.status) {
            case ErrorRsp.ERR_NOT_FOUND:
              newErrors.email = standardErrorMessage;
              break;
            case ErrorRsp.ERR_PARAM:
              newErrors.password = standardErrorMessage;
              break;
            default:
              newErrors.form = standardErrorMessage;
              break;
          }
          setErrors({ ...errors, ...newErrors });
        }
      } catch (error) {
        console.error("Login failed:", error);
        setErrors({
          ...errors,
          form: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputField
        type="email"
        placeholder="Enter Your UofT Email Address"
        onChange={handleEmailChange}
        errorMessage={errors.email || ""}
      />

      <PasswordInput
        onPasswordChange={handlePasswordChange}
        errorMessage={errors.password || ""}
        dontShowRequirements
        placeholder="Enter Your Password"
      />

      <LoginButton type="submit" isDisabled={isButtonDisabled}>
        Login
      </LoginButton>

      <LinkText>
        Don't have an account?{" "}
        <LinkStyled to="/register">
          <b>Register</b>
        </LinkStyled>
      </LinkText>

      {errors.form && <ErrorText>{errors.form}</ErrorText>}
    </FormContainer>
  );
};

export { LoginForm };
