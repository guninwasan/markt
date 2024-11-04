import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { LoginForm } from "./login-form";
import { store } from "../../redux/store";
import { Provider } from "react-redux";

describe("LoginForm Component", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Router>
          renderWithRedux(<LoginForm />);
        </Router>
      </Provider>
    );
  });


  it("should render form with email and password fields and login button", () => {
    expect(
      screen.getByPlaceholderText("UofT Email Address")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should enable login button when valid email and password are entered", () => {
    const loginButton = screen.getByRole("button", { name: "Login" });
    const emailInput = screen.getByPlaceholderText("UofT Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(loginButton).not.toBeDisabled();
  });

  it("should show validation error when password field is blurred without input", () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.blur(passwordInput);
    expect(
      screen.queryByText("A valid email is required")
    ).not.toBeInTheDocument();
  });

  it("should navigate to register page when 'Register' link is clicked", () => {
    const registerLink = screen.getByText("Register");
    expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
  });
});
