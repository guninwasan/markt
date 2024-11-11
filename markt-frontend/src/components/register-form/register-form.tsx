import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorRsp } from "../../errorCodes";
import { API_BASE_URL } from "../api";
import { RegisterButton } from "./register-form.styles";
import { PasswordInput } from "../password-input";
import { InputField } from "../input-field/input-field";

const REGISTER_URL = `${API_BASE_URL}/api/user/register`;

const RegisterForm = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    form: "",
  });

  const navigate = useNavigate();

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
          confirmPassword: "",
          phone: "",
          form: "",
        });
      } else {
        console.error("Registration failed:", result);

        const fieldErrors: { [key: string]: string } = {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
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
      <InputField type="text" placeholder="Full Name" onChange={setFullName} />
      {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}

      <InputField
        type="email"
        placeholder="UofT Email Address"
        onChange={setEmail}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <PasswordInput
        onPasswordChange={setPassword}
        errorMessage={errors.password || ""}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <PasswordInput
        onPasswordChange={setConfirmPassword}
        errorMessage={errors.password || ""}
        dontShowRequirements
        placeholder="Confirm Password"
      />

      <InputField type="tel" placeholder="Phone No." onChange={setPhone} />
      {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

      <RegisterButton type="submit">Create Account</RegisterButton>

      <div style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#000000" }}>
          <b>Sign In</b>
        </Link>
      </div>

      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
    </form>
  );
};

export { RegisterForm };
