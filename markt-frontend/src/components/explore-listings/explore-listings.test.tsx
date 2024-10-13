import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExploreListings } from "./explore-listings";

describe("ExploreListings", () => {
  it("should render the header", () => {
    render(<ExploreListings />);
    const headerElement = screen.getByText(/Explore Listings/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("should render the subheaders", () => {
    render(<ExploreListings />);
    const featuredSubheader = screen.getByText(/Featured Listings/i);
    const newSubheader = screen.getByText(/New to the Market/i);
    const priceDropsSubheader = screen.getByText(/Price Drops/i);

    expect(featuredSubheader).toBeInTheDocument();
    expect(newSubheader).toBeInTheDocument();
    expect(priceDropsSubheader).toBeInTheDocument();
  });

  it("should update the listings when a subheader is clicked", () => {
    render(<ExploreListings />);
    const newSubheader = screen.getByText(/New to the Market/i);
    fireEvent.click(newSubheader);

    const newListing1 = screen.getByText(/New Listing 1/i);
    expect(newListing1).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(<ExploreListings />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
