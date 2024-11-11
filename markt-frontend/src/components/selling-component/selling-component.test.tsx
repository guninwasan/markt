import React from "react";
import { render } from "@testing-library/react";
import { SellingComponent } from "./selling-component";

jest.mock("./sections", () => ({
  EssentialDetails: () => <div>EssentialDetails Component</div>,
  MediaSection: () => <div>MediaSection Component</div>,
  ProductFlairs: () => <div>ProductFlairs Component</div>,
  Specifications: () => <div>Specifications Component</div>,
  AdditionalDetails: () => <div>AdditionalDetails Component</div>,
}));

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe("SellingComponent", () => {
  it("should render all sections", () => {
    const { getByText } = render(<SellingComponent />);
    expect(getByText("EssentialDetails Component")).toBeInTheDocument();
    expect(getByText("MediaSection Component")).toBeInTheDocument();
    expect(getByText("ProductFlairs Component")).toBeInTheDocument();
    expect(getByText("Specifications Component")).toBeInTheDocument();
    expect(getByText("AdditionalDetails Component")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<SellingComponent />);
    expect(container).toMatchSnapshot();
  });
});
