import React from "react";
import { screen } from "@testing-library/react";
import { ProductListingComponent } from "./product-listing-component";
import { useIsMobile } from "../../hooks";
import { ProductSpecs } from "./product-specifications";
import { renderWithRedux } from "../../utils/render-with-redux";

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
    const { container } = renderWithRedux(<ProductListingComponent />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly on mobile", () => {
    mockUseIsMobile.mockReturnValue({ isMobile: true });
    const { container } = renderWithRedux(<ProductListingComponent />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders product details correctly", () => {
    renderWithRedux(<ProductListingComponent />);
    expect(screen.getByText(/CAD/)).toBeInTheDocument();
    expect(screen.getByText(/SELLER ID/)).toBeInTheDocument();
  });
});
