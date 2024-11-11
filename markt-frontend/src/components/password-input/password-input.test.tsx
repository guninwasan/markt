import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordInput } from "../password-input";

describe("PasswordInput", () => {
  it("should render the PasswordInput component", () => {
    render(<PasswordInput />);
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
  });

  it("should toggle password visibility", () => {
    render(<PasswordInput />);
    const input = screen.getByPlaceholderText("Enter your password");
    const toggleButton = screen.getByRole("button");

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should display password requirements", () => {
    render(<PasswordInput />);
    const input = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(input, { target: { value: "Passw0rd!" } });

    expect(
      screen.getByText("Be at least 8 characters in length")
    ).toBeInTheDocument();
    expect(screen.getByText("A lower case letter (a-z)")).toBeInTheDocument();
    expect(screen.getByText("An upper case letter (A-Z)")).toBeInTheDocument();
    expect(screen.getByText("A number (i.e. 0-9)")).toBeInTheDocument();
    expect(
      screen.getByText("A special character (@$!%*?&#)")
    ).toBeInTheDocument();
  });

  it("should show error message when provided", () => {
    const errorMessage = "Password is required";
    render(<PasswordInput errorMessage={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<PasswordInput />);
    expect(container).toMatchSnapshot();
  });
});
