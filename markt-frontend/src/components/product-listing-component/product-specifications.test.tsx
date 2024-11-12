import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductSpecs } from "./product-specifications";

const mockSpecs = {
  additional_details: "Some additional details",
  battery_life: "10 hours",
  brand: "BrandName",
  color: "Red",
  dimensions: "10x10x10 cm",
  material: "Plastic",
  model: "Model123",
  quantity: 5,
  storage_capacity: "256GB",
  weight: "1kg",
};

describe("ProductSpecifications", () => {
  it("should render the Product Specifications title", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Product Specifications")).toBeInTheDocument();
  });

  it("should render additional details", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Some additional details")).toBeInTheDocument();
  });

  it("should render battery life", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Battery Life: 10 hours")).toBeInTheDocument();
  });

  it("should render brand", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Brand: BrandName")).toBeInTheDocument();
  });

  it("should render color", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Color: Red")).toBeInTheDocument();
  });

  it("should render dimensions", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Dimensions: 10x10x10 cm")).toBeInTheDocument();
  });

  it("should render material", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Material: Plastic")).toBeInTheDocument();
  });

  it("should render model", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Model: Model123")).toBeInTheDocument();
  });

  it("should render quantity", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Quantity: 5")).toBeInTheDocument();
  });

  it("should render storage capacity", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Storage Capacity: 256GB")).toBeInTheDocument();
  });

  it("should render weight", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Weight: 1kg")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<ProductSpecs specs={mockSpecs} />);
    expect(container).toMatchSnapshot();
  });
});
