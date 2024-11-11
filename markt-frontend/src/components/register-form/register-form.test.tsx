import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { RegisterForm } from "./register-form";
import { ErrorRsp } from "../../errorCodes";

// At the top of your RegisterForm component file (e.g., register-form.tsx)
const BASE_URL = process.env.NODE_ENV === 'test' ? 'http://localhost:5000' : 'https://project-1-web-application-design-group15.onrender.com';
const REGISTER_URL = `${BASE_URL}/api/user/register`;

// Mock window.alert
window.alert = jest.fn();

describe("RegisterForm Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );
  });

  it("should render form with full name, email, password, phone fields and create account button", () => {
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("UofT Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone No.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
  });

  it("should show error messages for invalid or empty fields on blur", () => {
    act(() => {
      fireEvent.blur(screen.getByPlaceholderText("Full Name"));
    });
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();

    act(() => {
      fireEvent.blur(screen.getByPlaceholderText("UofT Email Address"));
    });
    expect(screen.getByText("A valid email is required")).toBeInTheDocument();

    act(() => {
      fireEvent.blur(screen.getByPlaceholderText("Password"));
    });
    expect(screen.getByText("Password is required")).toBeInTheDocument();

    act(() => {
      fireEvent.blur(screen.getByPlaceholderText("Phone No."));
    });
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
  });

  it("should enable create account button when all fields are valid", () => {
    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), { target: { value: "john.doe@mail.utoronto.ca" } });
      fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Password@123" } });
      fireEvent.change(screen.getByPlaceholderText("Phone No."), { target: { value: "1234567890" } });
    });

    const createAccountButton = screen.getByRole("button", { name: "Create Account" });
    expect(createAccountButton).not.toBeDisabled();
  });

  it("should handle successful form submission", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "User registered successfully" }),
      })
    ) as jest.Mock;

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), { target: { value: "john@mail.utoronto.ca" } });
      fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByPlaceholderText("Phone No."), { target: { value: "1234567890" } });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(REGISTER_URL, expect.anything());
      expect(window.alert).toHaveBeenCalledWith("Registration successful - redirecting to Login!");
    });
  });

  it("should handle existing user error (ERR_PARAM_DUP)", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ status: ErrorRsp.ERR_PARAM_DUP }),
      })
    ) as jest.Mock;

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), { target: { value: "existinguser@mail.utoronto.ca" } });
      fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    await waitFor(() => {
      expect(screen.getByText("User already exists!")).toBeInTheDocument();
    });
  });

  it("should handle validation errors from the backend (ERR_PARAM)", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            status: ErrorRsp.ERR_PARAM,
            data: ["Email format is invalid", "Phone number is invalid"],
          }),
      })
    ) as jest.Mock;

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), { target: { value: "invalid-email" } });
      fireEvent.change(screen.getByPlaceholderText("Phone No."), { target: { value: "123" } });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    await waitFor(() => {
      expect(screen.getByText("Email format is invalid")).toBeInTheDocument();
      expect(screen.getByText("Phone number is invalid")).toBeInTheDocument();
    });
  });

  it("should show a general error message on an unexpected error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), { target: { value: "john@mail.utoronto.ca" } });
      fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByPlaceholderText("Phone No."), { target: { value: "1234567890" } });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  it("should navigate to login page when 'Sign In' link is clicked", () => {
    const signInLink = screen.getByText("Sign In");
    expect(signInLink.closest("a")).toHaveAttribute("href", "/login");
  });
});
