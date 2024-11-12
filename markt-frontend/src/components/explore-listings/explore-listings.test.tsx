import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExploreListings } from "./explore-listings";

jest.mock("../listing-container", () => ({
  ListingContainer: () => <div>New Listing 1</div>,
}));

describe("ExploreListings", () => {
  it("should render the header", () => {
    render(<ExploreListings />);
    const headerElement = screen.getByText(/Explore Listings/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the subheaders", () => {
    render(<ExploreListings />);
    const featuredSubheader = screen.getByText(/Featured Listings/i);
    const newSubheader = screen.getByText(/Hot/i);

    expect(featuredSubheader).toBeInTheDocument();
    expect(newSubheader).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(<ExploreListings />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
