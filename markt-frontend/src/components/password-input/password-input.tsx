import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import {
  Container,
  PasswordWrapper,
  Input,
  EyeButton,
  ErrorMessage,
  Requirements,
  RequirementItem,
} from "./password-input.styles";

type PasswordInputProps = {
  placeholder?: string;
  onPasswordChange?: (password: string) => void;
  errorMessage?: string;
  dontShowRequirements?: boolean;
};

const PasswordInput = ({
  placeholder,
  onPasswordChange,
  errorMessage,
  dontShowRequirements,
}: PasswordInputProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = (event: any) => {
    event.preventDefault();

    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    onPasswordChange?.(value);
  };

  const isAtLeast8Chars = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);

  return (
    <Container>
      <PasswordWrapper>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || "Enter your password"}
          value={password}
          onChange={handlePasswordChange}
          showPassword={showPassword}
          errorMessage={errorMessage}
        />
        <EyeButton onClick={toggleShowPassword}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </EyeButton>
      </PasswordWrapper>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {password && !dontShowRequirements && (
        <Requirements>
          <RequirementItem fulfilled={isAtLeast8Chars}>
            {isAtLeast8Chars ? <FaCheck /> : <FaTimes />}
            Be at least 8 characters in length
          </RequirementItem>
          <RequirementItem fulfilled={hasLowerCase}>
            {hasLowerCase ? <FaCheck /> : <FaTimes />}A lower case letter (a-z)
          </RequirementItem>
          <RequirementItem fulfilled={hasUpperCase}>
            {hasUpperCase ? <FaCheck /> : <FaTimes />}
            An upper case letter (A-Z)
          </RequirementItem>
          <RequirementItem fulfilled={hasNumber}>
            {hasNumber ? <FaCheck /> : <FaTimes />}A number (i.e. 0-9)
          </RequirementItem>
          <RequirementItem fulfilled={hasSpecialChar}>
            {hasSpecialChar ? <FaCheck /> : <FaTimes />}A special character
            (@$!%*?&#)
          </RequirementItem>
        </Requirements>
      )}
    </Container>
  );
};

export { PasswordInput };
