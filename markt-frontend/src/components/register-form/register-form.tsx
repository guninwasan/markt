import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorRsp } from "../../errorCodes";
import { API_BASE_URL } from "../api";
import {
  RegisterButton,
  FormContainer,
  ErrorText,
  LinkText,
  LinkStyled,
} from "./register-form.styles";
import { PasswordInput } from "../password-input";
import { InputField } from "../input-field";
import { passwordCheck } from "../../utils/password-check";

const REGISTER_URL = `${API_BASE_URL}/api/user/register`;

type FormFields = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

type FormErrors = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  form: string;
};

const RegisterForm = () => {
  const [formFields, setFormFields] = useState<FormFields>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [disabled, setDisabled] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    form: "",
  });

  const [showErrors, setShowErrors] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@(mail\.)?utoronto\.ca$/.test(email);

  const validateFields = () => {
    const newErrors: FormErrors = {
      fullName: formFields.fullName ? "" : "Full Name is a required field.",
      email: validateEmail(formFields.email) ? "" : "Invalid UofT email.",
      password: passwordCheck(formFields.password)
        ? ""
        : "Password must meet the requirements.",
      confirmPassword: !formFields.confirmPassword
        ? "Confirm Password is a required field."
        : formFields.password === formFields.confirmPassword
        ? ""
        : "Passwords do not match.",
      phone: formFields.phone ? "" : "Phone number is a required field.",
      form: "",
    };
    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formFields).every(Boolean);
    setDisabled(!allFieldsFilled);
  }, [formFields]);

  const handleInputChange = (field: keyof FormFields) => (value: string) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrors(true);

    if (validateFields()) {
      try {
        const response = await fetch(REGISTER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: formFields.fullName,
            password: formFields.password,
            email: formFields.email,
            phone: formFields.phone,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Registration successful - redirecting to Login!");
          setErrors({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            form: "",
          });
          navigate("/login");
        } else {
          handleErrors(result);
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          form: "An unexpected error occurred. Please try again later.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        form: "Please fill in all fields correctly before submitting.",
      }));
    }
  };

  const handleErrors = (result: any) => {
    const fieldErrors: FormErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      form: "",
    };

    switch (result.status) {
      case ErrorRsp.ERR_PARAM_DUP:
        fieldErrors.email = "User already exists!";
        break;
      case ErrorRsp.ERR_PARAM:
        if (Array.isArray(result.data)) {
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
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputField
        type="text"
        placeholder="Enter Your Full Name"
        onChange={handleInputChange("fullName")}
        errorMessage={showErrors ? errors.fullName : ""}
      />

      <InputField
        type="email"
        placeholder="Enter Your UofT Email Address"
        onChange={handleInputChange("email")}
        errorMessage={showErrors ? errors.email : ""}
      />

      <PasswordInput
        onPasswordChange={handleInputChange("password")}
        errorMessage={showErrors ? errors.password : ""}
        placeholder="Enter Your Password"
      />

      <PasswordInput
        onPasswordChange={handleInputChange("confirmPassword")}
        errorMessage={showErrors ? errors.confirmPassword : ""}
        dontShowRequirements
        placeholder="Confirm Your Password"
      />

      <InputField
        type="tel"
        placeholder="Enter Your Phone No."
        onChange={handleInputChange("phone")}
        errorMessage={showErrors ? errors.phone : ""}
      />

      <RegisterButton
        type="submit"
        isDisabled={disabled}
        onClick={() => {
          if (disabled) {
            setErrors((prev) => ({
              ...prev,
              form: "Please complete all fields correctly to proceed.",
            }));
          }
        }}
      >
        Create Account
      </RegisterButton>

      <LinkText>
        Already have an account?{" "}
        <LinkStyled to="/login">
          <b>Sign In</b>
        </LinkStyled>
      </LinkText>

      {errors.form && <ErrorText>{errors.form}</ErrorText>}
    </FormContainer>
  );
};

export { RegisterForm };
