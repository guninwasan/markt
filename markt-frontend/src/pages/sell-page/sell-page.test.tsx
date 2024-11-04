import React from "react";
import { render, screen } from "@testing-library/react";
import { SellPage } from "./sell-page";

jest.mock("../../components", () => ({
  Navbar: () => <div data-testid="navbar">Mocked Navbar</div>,
  SellingComponent: () => (
    <div data-testid="selling-component">Mocked SellingComponent</div>
  ),
}));

describe("SellPage", () => {
  it("renders Navbar and SellingComponent", () => {
    render(<SellPage />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();

    expect(screen.getByTestId("selling-component")).toBeInTheDocument();
    expect(screen.getByText("Mocked SellingComponent")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<SellPage />);
    expect(container).toMatchSnapshot();
  });
});
