import React from "react";
import { render } from "@testing-library/react";
import { SearchPage } from "./search-page";

jest.mock("../../components", () => ({
  ExploreListings: () => <div>ExploreListings Mock</div>,
  Navbar: () => <div>Navbar Mock</div>,
  SearchResults: () => <div>SearchResults Mock</div>,
}));

describe("SearchPage", () => {
  it("renders the Navbar, SearchResults, and ExploreListings components", () => {
    const { getByText } = render(<SearchPage />);

    expect(getByText("Navbar Mock")).toBeInTheDocument();
    expect(getByText("SearchResults Mock")).toBeInTheDocument();
    expect(getByText("ExploreListings Mock")).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(<SearchPage />);
    expect(container).toMatchSnapshot();
  });
});
