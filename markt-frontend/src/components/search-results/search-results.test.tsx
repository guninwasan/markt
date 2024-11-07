import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchResults } from "./search-results";
import { useSearchParams } from "react-router-dom";
import { renderWithRouter } from "../../utils/render-with-router";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

describe("SearchResults", () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;

  beforeEach(() => {
    mockUseSearchParams.mockReturnValue([
      {
        get: jest.fn().mockReturnValue("test"),
      },
    ]);
  });

  it("should render search results", () => {
    renderWithRouter(<SearchResults />);
    expect(
      screen.getByText("Your search results for: test")
    ).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = renderWithRouter(<SearchResults />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
