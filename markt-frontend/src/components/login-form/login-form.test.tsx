import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./login-form";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { ErrorRsp } from "../../errorCodes";

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock useDispatch globally
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("LoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );
  });

  it("submits successfully with valid credentials", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        userID: "12345",
        name: "Test User",
        email: "test@utoronto.ca",
        phone: "123-456-7890",
        token: "test-jwt-token",
      }),
    });
  
    // Mock window.alert to verify it was called
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
  
    // Fill in valid credentials
    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "test@utoronto.ca" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
  
    // Wait for async actions to complete
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Login successful! Redirecting to Home...");
      expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
    });
  
    // Clean up the mock
    alertMock.mockRestore();
  });

  it("shows error for invalid email format", async () => {
    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.blur(screen.getByPlaceholderText("UofT Email Address"));

    expect(screen.getByText("A valid UofT email is required")).toBeInTheDocument();
  });

  it("shows error when backend responds with incorrect password error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ status: ErrorRsp.ERR_PARAM }),
    });

    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "test@utoronto.ca" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect password")).toBeInTheDocument();
    });
  });

  it("shows a general error message on unexpected server error", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Server is down"));

    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "test@utoronto.ca" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  it("disables the submit button if email or password fields are empty", () => {
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Check initially disabled
    expect(loginButton).toBeDisabled();

    // Fill email only
    fireEvent.change(screen.getByPlaceholderText("UofT Email Address"), {
      target: { value: "test@utoronto.ca" },
    });
    expect(loginButton).toBeDisabled();

    // Fill password only
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    expect(loginButton).not.toBeDisabled();
  });
});
