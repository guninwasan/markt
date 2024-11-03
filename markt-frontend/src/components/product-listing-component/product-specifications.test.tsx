import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductSpecs } from "./product-specifications";

const mockSpecs = {
  basicInfo: {
    condition: "New",
    brand: "BrandName",
    model: "ModelX",
    yearOfManufacture: "2022",
  },
  appearance: {
    color: "Black",
    dimensions: "10x5x2 inches",
    weight: "1.5 lbs",
    material: "Plastic",
  },
  performance: {
    batteryLife: "10 hours",
    storageCapacity: "256GB",
    additionalFeatures: "Waterproof, Bluetooth",
  },
  warranty: "2 years",
};

describe("ProductSpecs", () => {
  it("should render the Product Specifications title", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Product Specifications")).toBeInTheDocument();
  });

  it("should render basic information", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByText("Condition: New")).toBeInTheDocument();
    expect(screen.getByText("Brand: BrandName")).toBeInTheDocument();
    expect(screen.getByText("Model: ModelX")).toBeInTheDocument();
    expect(screen.getByText("Year: 2022")).toBeInTheDocument();
  });

  it("should render appearance information", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Color: Black")).toBeInTheDocument();
    expect(screen.getByText("Dimensions: 10x5x2 inches")).toBeInTheDocument();
    expect(screen.getByText("Weight: 1.5 lbs")).toBeInTheDocument();
    expect(screen.getByText("Material: Plastic")).toBeInTheDocument();
  });

  it("should render performance information", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Battery Life: 10 hours")).toBeInTheDocument();
    expect(screen.getByText("Storage Capacity: 256GB")).toBeInTheDocument();
    expect(
      screen.getByText("Features: Waterproof, Bluetooth")
    ).toBeInTheDocument();
  });

  it("should render warranty information", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Warranty")).toBeInTheDocument();
    expect(screen.getByText("2 years")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<ProductSpecs specs={mockSpecs} />);
    expect(container).toMatchSnapshot();
  });
});
