import React, { useState } from "react";
import {
  Container,
  InputWrapper,
  Input,
  ErrorMessage,
} from "./input-field.styles";

type InputFieldProps = {
  type?: string;
  placeholder?: string;
  onChange?: any;
  errorMessage?: string;
};

const InputField = ({
  type,
  placeholder,
  onChange,
  errorMessage,
}: InputFieldProps) => {
  const [value, setValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Container>
      <InputWrapper>
        <Input
          type={type || "text"}
          placeholder={placeholder || "Enter text"}
          value={value}
          onChange={handleInputChange}
        />
      </InputWrapper>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
};

export { InputField };
