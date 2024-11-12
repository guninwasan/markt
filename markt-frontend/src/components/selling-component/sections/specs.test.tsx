import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Specifications } from "./specs";

describe("Specifications Component", () => {
  const mockHandleChange = jest.fn();
  const formData = {
    brand: "BrandName",
    model: "ModelName",
    color: "Red",
    dimensions: "10x10x10",
    weight: "1kg",
    material: "Plastic",
    batteryLife: "10 hours",
    storageCapacity: "256GB",
  };

  beforeEach(() => {
    render(
      <Specifications formData={formData} handleChange={mockHandleChange} />
    );
  });

  it("should render section header", () => {
    expect(screen.getByText("Specifications (Optional)")).toBeInTheDocument();
  });

  it("should render all specification fields with correct values", () => {
    const specs = [
      "brand",
      "model",
      "color",
      "dimensions",
      "weight",
      "material",
      "batteryLife",
      "storageCapacity",
    ];

    specs.forEach((spec) => {
      const input = screen.getByPlaceholderText(`Enter ${spec}`);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(formData[spec as keyof typeof formData] || "");
    });
  });

  it("should call handleChange on input change", () => {
    const input = screen.getByPlaceholderText("Enter brand");
    fireEvent.change(input, { target: { value: "NewBrand" } });
    expect(mockHandleChange).toHaveBeenCalled();
  });
});
