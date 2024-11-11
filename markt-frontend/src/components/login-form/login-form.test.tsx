import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./login-form";
import { API_BASE_URL } from "../api";
import { renderWithRedux } from "../../utils/render-with-redux";

describe("LoginForm", () => {
  beforeEach(() => {
    renderWithRedux(<LoginForm />);
  });

  it("should render email and password input fields", () => {
    expect(
      screen.getByPlaceholderText("Enter Your UofT Email Address")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Your Password")
    ).toBeInTheDocument();
  });

  it("should display error messages for empty fields", () => {
    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByText("Please enter a password.")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid UofT email.")
    ).toBeInTheDocument();
  });

  it("should display error message for invalid email", () => {
    fireEvent.change(
      screen.getByPlaceholderText("Enter Your UofT Email Address"),
      {
        target: { value: "invalidemail" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter Your Password"), {
      target: { value: "validpassword123" },
    });
    fireEvent.click(screen.getByText("Login"));

    expect(
      screen.getByText(
        "This email and password combination doesn't exist in our records. Please try again."
      )
    ).toBeInTheDocument();
  });

  it("should display error message for invalid password", () => {
    fireEvent.change(
      screen.getByPlaceholderText("Enter Your UofT Email Address"),
      {
        target: { value: "test@mail.utoronto.ca" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter Your Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByText("Login"));

    expect(
      screen.getByText(
        "This email and password combination doesn't exist in our records. Please try again."
      )
    ).toBeInTheDocument();
  });

  it("should call API on valid form submission", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            userID: 1,
            name: "Test User",
            email: "test@mail.utoronto.ca",
            phone: "1234567890",
            token: "fake-jwt-token",
          }),
      })
    ) as jest.Mock;

    fireEvent.change(
      screen.getByPlaceholderText("Enter Your UofT Email Address"),
      {
        target: { value: "test@mail.utoronto.ca" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter Your Password"), {
      target: { value: "validpassword123" },
    });
    fireEvent.click(screen.getByText("Login"));

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/user/login`,
      expect.any(Object)
    );
  });

  it("should match snapshot", () => {
    const { container } = renderWithRedux(<LoginForm />);
    expect(container).toMatchSnapshot();
  });
});
