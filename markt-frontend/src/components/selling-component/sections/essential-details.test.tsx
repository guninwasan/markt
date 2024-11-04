import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EssentialDetails } from "./essential-details";

describe("EssentialDetails Component", () => {
  const mockHandleChange = jest.fn();
  const mockHandlePriceChange = jest.fn();
  const formData = {
    title: "Sample Product",
    price: "100",
    description: "This is a sample product.",
    negotiable: true,
  };
  const priceError = "Please enter a valid positive number for price.";

  beforeEach(() => {
    render(
      <EssentialDetails
        formData={formData}
        handleChange={mockHandleChange}
        handlePriceChange={mockHandlePriceChange}
        priceError={priceError}
      />
    );
  });

  it("should render section header", () => {
    expect(screen.getByText("Essential Details")).toBeInTheDocument();
  });

  it("should render title input with correct value", () => {
    const titleInput = screen.getByPlaceholderText("Enter the product title");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(formData.title);
  });

  it("should render price input with correct value", () => {
    const priceInput = screen.getByPlaceholderText("Enter the product price");
    expect(priceInput).toBeInTheDocument();
    expect(priceInput).toHaveValue(formData.price);
  });

  it("should render price error message", () => {
    expect(screen.getByText(priceError)).toBeInTheDocument();
  });

  it("should render description text area with correct value", () => {
    const descriptionTextArea = screen.getByPlaceholderText(
      "Provide a detailed description of the item..."
    );
    expect(descriptionTextArea).toBeInTheDocument();
    expect(descriptionTextArea).toHaveValue(formData.description);
  });

  it("should render negotiable checkbox with correct value", () => {
    const negotiableCheckbox = screen.getByLabelText("Price Negotiable");
    expect(negotiableCheckbox).toBeInTheDocument();
    expect(negotiableCheckbox).toBeChecked();
  });

  it("should call handleChange on title input change", () => {
    const titleInput = screen.getByPlaceholderText("Enter the product title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("should call handlePriceChange on price input change", () => {
    const priceInput = screen.getByPlaceholderText("Enter the product price");
    fireEvent.change(priceInput, { target: { value: "200" } });
    expect(mockHandlePriceChange).toHaveBeenCalled();
  });

  it("should call handleChange on description text area change", () => {
    const descriptionTextArea = screen.getByPlaceholderText(
      "Provide a detailed description of the item..."
    );
    fireEvent.change(descriptionTextArea, {
      target: { value: "Updated Description" },
    });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("should call handleChange on negotiable checkbox change", () => {
    const negotiableCheckbox = screen.getByLabelText("Price Negotiable");
    fireEvent.click(negotiableCheckbox);
    expect(mockHandleChange).toHaveBeenCalled();
  });
});
