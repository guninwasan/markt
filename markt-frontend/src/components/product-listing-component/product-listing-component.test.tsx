import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductListingComponent } from "./product-listing-component";
import { useIsMobile } from "../../hooks";

jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
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
    render(<ProductListingComponent />);
    expect(screen.getByText("Product Title")).toBeInTheDocument();
    expect(screen.getByText("CAD $$$")).toBeInTheDocument();
    expect(screen.getByText("Specification 1")).toBeInTheDocument();
  });

  it("renders product details correctly", () => {
    render(<ProductListingComponent />);
    expect(screen.getByText("Product Title")).toBeInTheDocument();
    expect(screen.getByText(/Description description/)).toBeInTheDocument();
    expect(screen.getByText("CAD $$$")).toBeInTheDocument();
    expect(screen.getByText("NAME BLURRED")).toBeInTheDocument();
    expect(screen.getByText("SELLER ID # 1234")).toBeInTheDocument();
    expect(screen.getByText("See all seller reviews")).toBeInTheDocument();
  });

  it("renders product specifications correctly", () => {
    render(<ProductListingComponent />);
    expect(screen.getByText("Product Specifications")).toBeInTheDocument();
    expect(screen.getByText("Specification 1")).toBeInTheDocument();
    expect(screen.getByText("Specification 2")).toBeInTheDocument();
    expect(screen.getByText("Specification 3")).toBeInTheDocument();
    expect(screen.getByText("Specification 4")).toBeInTheDocument();
  });
});
