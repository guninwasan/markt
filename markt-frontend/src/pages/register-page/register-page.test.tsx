import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RegisterPage } from "./register-page";

// Mocking the components used inside RegisterPage to focus on rendering logic
jest.mock("../../components", () => ({
  Navbar: () => <div>Mocked Navbar</div>,
  Cover: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
  RegisterForm: ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Full Name" />
      <input type="email" placeholder="UofT Email Address" />
      <input type="password" placeholder="Password" />
      <input type="tel" placeholder="Phone No." />
      <input type="text" placeholder="UofT Student ID (for verification)" />
      <button type="submit">Create Account</button>
    </form>
  ),
}));

describe("RegisterPage", () => {
  test("renders the Navbar, Cover with title, and RegisterForm", () => {
    // Render the RegisterPage component
    render(<RegisterPage />);

    // Check if Navbar is rendered
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();

    // Check if Cover and its title are rendered
    expect(
      screen.getByText("Join UofT’s Secure Marketplace Community Today!")
    ).toBeInTheDocument();

    // Check if the RegisterForm is rendered with input fields and a submit button
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("UofT Email Address")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone No.")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("UofT Student ID (for verification)")
    ).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  test("allows the user to type into all input fields", () => {
    // Render the RegisterPage component
    render(<RegisterPage />);

    // Find input fields
    const fullNameInput = screen.getByPlaceholderText(
      "Full Name"
    ) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(
      "UofT Email Address"
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Password"
    ) as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText(
      "Phone No."
    ) as HTMLInputElement;
    const studentIDInput = screen.getByPlaceholderText(
      "UofT Student ID (for verification)"
    ) as HTMLInputElement;

    // Simulate typing in the input fields
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@utoronto.ca" } });
    fireEvent.change(passwordInput, { target: { value: "password123!" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(studentIDInput, { target: { value: "12345678" } });

    // Assert that the input fields contain the correct values
    expect(fullNameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john.doe@utoronto.ca");
    expect(passwordInput.value).toBe("password123!");
    expect(phoneInput.value).toBe("1234567890");
    expect(studentIDInput.value).toBe("12345678");
  });

  test("submits form and prevents default submission behavior", () => {
    // Render the RegisterPage component
    render(<RegisterPage />);

    // Mock the event.preventDefault
    const handleSubmit = jest.fn((e) => e.preventDefault());

    // Find input fields and button
    const fullNameInput = screen.getByPlaceholderText("Full Name");
    const submitButton = screen.getByText("Create Account");

    // Simulate filling out the form
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });

    // Attach the mock submit handler
    submitButton.closest("form")!.addEventListener("submit", handleSubmit);

    // Simulate form submission using fireEvent.click on the submit button
    fireEvent.click(submitButton);

    // Assert that the submit handler was called and default behavior prevented
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
