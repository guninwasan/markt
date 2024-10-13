import { render, screen } from "@testing-library/react";
import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("should render the navbar properly", () => {
    render(<Navbar />);
    expect(document.querySelector("nav")).toBeInTheDocument();
  });

  it("should render the Markt name", () => {
    render(<Navbar />);
    const marktText = screen.getByText(/Markt/i);
    expect(marktText).toBeInTheDocument();
  });

  it("should render the Home, Buy, Sell link", () => {
    render(<Navbar />);
    const homeLink = screen.getByText(/Home/i);
    const buyLink = screen.getByText(/Buy/i);
    const sellLink = screen.getByText(/Sell/i);
    expect(homeLink).toBeInTheDocument();
    expect(buyLink).toBeInTheDocument();
    expect(sellLink).toBeInTheDocument();
  });
});
