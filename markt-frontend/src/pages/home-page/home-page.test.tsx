import React from "react";
import { render, screen } from "@testing-library/react";
import { HomePage } from "./home-page";

jest.mock("../../components", () => ({
  ExploreListings: () => (
    <div data-testid="explore-listings">Explore Listings</div>
  ),
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

describe("HomePage", () => {
  it("should render Navbar", () => {
    render(<HomePage />);
    const navbarElement = screen.getByTestId("navbar");
    expect(navbarElement).toBeInTheDocument();
  });

  it("should render the image", () => {
    render(<HomePage />);
    const imageElement = screen.getByAltText("Cover Image");
    expect(imageElement).toBeInTheDocument();
  });

  it("should render Explore Listings component", () => {
    render(<HomePage />);
    const exploreListingsElement = screen.getByTestId("explore-listings");
    expect(exploreListingsElement).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(<HomePage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
