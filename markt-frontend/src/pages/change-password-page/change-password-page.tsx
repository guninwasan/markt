import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../components/api";
import { Navbar } from "../../components";
import { PasswordInput } from "../../components/password-input";
import {
  FormContainer,
  ErrorText,
  ChangePasswordButton,
} from "./change-password-page.styles";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../redux";

const CHANGE_PASSWORD_URL = `${API_BASE_URL}/api/user/change-password`;

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePasswords = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New password and confirmation do not match.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    try {
      dispatch(setIsLoading(true));
      const response = await fetch(CHANGE_PASSWORD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(setIsLoading(false));
        alert("Password changed successfully! Redirecting to Profile.");
        navigate("/profile");
      } else {
        const newErrors = { ...errors };
        switch (result.status) {
          case 401:
            newErrors.currentPassword = "Current password is incorrect.";
            break;
          case 400:
            newErrors.form = "Invalid input. Please try again.";
            break;
          default:
            newErrors.form =
              "An unexpected error occurred. Please try again later.";
            break;
        }
        setErrors({ ...errors, ...newErrors });
        dispatch(setIsLoading(false));
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Change password failed:", error);
      setErrors({
        ...errors,
        form: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar */}
      <FormContainer onSubmit={handleSubmit}>
        <h2>Change Password</h2>

        {errors.form && <ErrorText>{errors.form}</ErrorText>}

        <PasswordInput
          onPasswordChange={setCurrentPassword}
          errorMessage={errors.currentPassword || ""}
          dontShowRequirements
          placeholder="Enter Your Current Password"
        />

        <PasswordInput
          onPasswordChange={setNewPassword}
          errorMessage={errors.newPassword || ""}
          placeholder="Enter Your New Password"
        />

        <PasswordInput
          onPasswordChange={setConfirmPassword}
          errorMessage={errors.confirmPassword || ""}
          dontShowRequirements
          placeholder="Confirm Your New Password"
        />

        <ChangePasswordButton type="submit">Change Password</ChangePasswordButton>
      </FormContainer>
    </>
  );
};

export { ChangePasswordPage };
