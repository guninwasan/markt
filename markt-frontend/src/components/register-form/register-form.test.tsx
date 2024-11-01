import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { RegisterForm } from "./register-form";

describe("RegisterForm Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );
  });

  it("should render form with full name, email, password, phone, student ID fields and create account button", () => {
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("UofT Email Address")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone No.")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("UofT Student ID (for verification)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeInTheDocument();
  });

  it("should disable create account button if any field is invalid or empty", () => {
    const createAccountButton = screen.getByRole("button", {
      name: "Create Account",
    });
    expect(createAccountButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "invalid-email" },
    });
    expect(createAccountButton).toBeDisabled();
  });

  it("should show error messages for invalid or empty fields on blur", () => {
    fireEvent.blur(screen.getByPlaceholderText("Full Name"));
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();

    fireEvent.blur(screen.getByPlaceholderText("UofT Email Address"));
    expect(screen.getByText("A valid email is required")).toBeInTheDocument();

    fireEvent.blur(screen.getByPlaceholderText("Password"));
    expect(
      screen.getByText(
        "Password must be at least 8 characters long and contain at least one special character"
      )
    ).toBeInTheDocument();

    fireEvent.blur(screen.getByPlaceholderText("Phone No."));
    expect(
      screen.getByText("Phone number must be exactly 10 digits")
    ).toBeInTheDocument();

    fireEvent.blur(
      screen.getByPlaceholderText("UofT Student ID (for verification)")
    );
    expect(screen.getByText("Student ID is required")).toBeInTheDocument();
  });

  it("should enable create account button when all fields are valid", () => {
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "john.doe@mail.utoronto.ca" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password@123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone No."), {
      target: { value: "1234567890" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("UofT Student ID (for verification)"),
      { target: { value: "100200300" } }
    );

    const createAccountButton = screen.getByRole("button", {
      name: "Create Account",
    });
    expect(createAccountButton).not.toBeDisabled();
  });

  it("should navigate to login page when 'Sign In' link is clicked", () => {
    const signInLink = screen.getByText("Sign In");
    expect(signInLink.closest("a")).toHaveAttribute("href", "/login");
  });
});
