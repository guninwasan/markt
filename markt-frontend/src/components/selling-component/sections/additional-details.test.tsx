import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdditionalDetails } from "./additional-details";

describe("AdditionalDetails Component", () => {
  const mockHandleChange = jest.fn();
  const formData = {
    additionalDetails: "Some additional details",
  };

  beforeEach(() => {
    render(
      <AdditionalDetails formData={formData} handleChange={mockHandleChange} />
    );
  });

  it("should render section header", () => {
    expect(
      screen.getByTestId("additional-details-section-header")
    ).toBeInTheDocument();
  });

  it("should render label", () => {
    expect(
      screen.getByLabelText("Additional Details (Max 200 Chars.)")
    ).toBeInTheDocument();
  });

  it("should render text area with correct value", () => {
    const textArea = screen.getByPlaceholderText(
      "Add any extra information about the product"
    );
    expect(textArea).toBeInTheDocument();
    expect(textArea).toHaveValue(formData.additionalDetails);
  });

  it("should call handleChange on text area change", () => {
    const textArea = screen.getByPlaceholderText(
      "Add any extra information about the product"
    );
    fireEvent.change(textArea, { target: { value: "Updated details" } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <AdditionalDetails formData={formData} handleChange={mockHandleChange} />
    );
    expect(container).toMatchSnapshot();
  });
});
