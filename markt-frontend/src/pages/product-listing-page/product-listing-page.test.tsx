import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProductListingPage } from ".";
import { renderWithRouter } from "../../utils/render-with-router";

jest.mock("../../components", () => ({
  Navbar: () => <nav data-testid="navbar">nav</nav>,
  ProductListingComponent: () => (
    <div data-testid="product-listing-component" />
  ),
}));

describe("ProductListingPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders without crashing", () => {
    renderWithRouter(<ProductListingPage />);
  });

  it("renders Navbar component", () => {
    renderWithRouter(<ProductListingPage />);

    // Check for the presence of the navigation role
    const navbar = screen.getByText("nav");
    expect(navbar).toBeInTheDocument();
  });

  it("renders ProductListingComponent component", () => {
    renderWithRouter(<ProductListingPage />);

    expect(screen.getByTestId("product-listing-component")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = renderWithRouter(<ProductListingPage />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the correct number of children in the main div", () => {
    renderWithRouter(<ProductListingPage />);
    const mainDiv = screen.getByRole("navigation", {
      hidden: true,
    }).parentElement;
    expect(mainDiv?.children.length).toBe(2);
  });
});
