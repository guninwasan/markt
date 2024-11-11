import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "../input-field";

describe("InputField", () => {
  it("should render the InputField component", () => {
    render(<InputField />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("should call onChange when input value changes", () => {
    const handleChange = jest.fn();
    render(<InputField onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Enter text");

    fireEvent.change(input, { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledWith("test");
  });

  it("should display error message when provided", () => {
    const errorMessage = "This field is required";
    render(<InputField errorMessage={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should accept and display input value", () => {
    render(<InputField />);
    const input = screen.getByPlaceholderText("Enter text");

    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
  });

  it("should match snapshot", () => {
    const { container } = render(<InputField />);
    expect(container).toMatchSnapshot();
  });
});
