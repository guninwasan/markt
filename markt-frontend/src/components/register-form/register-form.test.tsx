import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { RegisterForm } from "./register-form";
import { renderWithRedux } from "../../utils/render-with-redux";
import { API_BASE_URL } from "../api";

const placeholders = {
  fullName: "Enter Your Full Name",
  email: "Enter Your UofT Email Address",
  password: "Enter Your Password",
  confirmPassword: "Confirm Your Password",
  phone: "Enter Your Phone No.",
};

const fillFormFields = (fields: Partial<typeof placeholders>) => {
  if (fields.fullName) {
    fireEvent.change(screen.getByPlaceholderText(placeholders.fullName), {
      target: { value: fields.fullName },
    });
  }
  if (fields.email) {
    fireEvent.change(screen.getByPlaceholderText(placeholders.email), {
      target: { value: fields.email },
    });
  }
  if (fields.password) {
    fireEvent.change(screen.getByPlaceholderText(placeholders.password), {
      target: { value: fields.password },
    });
  }
  if (fields.confirmPassword) {
    fireEvent.change(
      screen.getByPlaceholderText(placeholders.confirmPassword),
      {
        target: { value: fields.confirmPassword },
      }
    );
  }
  if (fields.phone) {
    fireEvent.change(screen.getByPlaceholderText(placeholders.phone), {
      target: { value: fields.phone },
    });
  }
};

describe("RegisterForm", () => {
  beforeEach(() => {
    renderWithRedux(<RegisterForm />);
  });

  it("should render all input fields", () => {
    Object.values(placeholders).forEach((placeholder) => {
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });
  });

  it("should display error messages for empty fields", () => {
    fireEvent.click(screen.getByText("Create Account"));

    expect(screen.getByText("Full Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Invalid UofT email.")).toBeInTheDocument();
    expect(
      screen.getByText("Password must meet the requirements.")
    ).toBeInTheDocument();
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
  });

  it("should display error message for invalid email", () => {
    fillFormFields({
      email: "invalidemail",
      password: "validpassword123",
      confirmPassword: "validpassword123",
      fullName: "Test User",
      phone: "1234567890",
    });
    fireEvent.click(screen.getByText("Create Account"));

    expect(screen.getByText("Invalid UofT email.")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = renderWithRedux(<RegisterForm />);
    expect(container).toMatchSnapshot();
  });

  it("should display error message for mismatched passwords", () => {
    fillFormFields({
      email: "test@mail.utoronto.ca",
      password: "Validpassword123@",
      confirmPassword: "differentPassword123@",
      fullName: "Test User",
      phone: "1234567890",
    });
    fireEvent.click(screen.getByText("Create Account"));

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  it("should call API on valid form submission", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    fillFormFields({
      email: "test@mail.utoronto.ca",
      password: "Validpassword123@",
      confirmPassword: "Validpassword123@",
      fullName: "Test User",
      phone: "1234567890",
    });
    fireEvent.click(screen.getByText("Create Account"));

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/user/register`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: "Test User",
          password: "Validpassword123@",
          email: "test@mail.utoronto.ca",
          phone: "1234567890",
        }),
      })
    );
  });

  it("should match snapshot", () => {
    const { container } = renderWithRedux(<RegisterForm />);
    expect(container).toMatchSnapshot();
  });
});
