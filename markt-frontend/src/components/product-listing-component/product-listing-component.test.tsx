import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductListingComponent } from "./product-listing-component";
import { useIsMobile } from "../../hooks";
import { ProductSpecs } from "./product-specifications";

jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
}));

jest.mock("./product-specifications", () => ({
  ProductSpecs: jest.fn(() => <div>Product Specifications</div>),
}));

describe("ProductListingComponent", () => {
  const mockUseIsMobile = useIsMobile as jest.Mock;

  beforeEach(() => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly on desktop", () => {
    const { container } = render(<ProductListingComponent />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly on mobile", () => {
    mockUseIsMobile.mockReturnValue({ isMobile: true });
    const { container } = render(<ProductListingComponent />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders product details correctly", () => {
    render(<ProductListingComponent />);
    expect(screen.getByText(/CAD/)).toBeInTheDocument();
    expect(screen.getByText(/SELLER ID/)).toBeInTheDocument();
  });
});
