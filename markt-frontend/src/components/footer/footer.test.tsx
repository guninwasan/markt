import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("should render the footer", () => {
    render(<Footer />);
    expect(screen.getByText(/MARKT by/i)).toBeInTheDocument();
  });

  it("should render all footer links", () => {
    render(<Footer />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
    expect(screen.getByText(/Support \/ Report an issue/i)).toBeInTheDocument();
  });

  it("should render the rights reserved text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2024 All rights reserved./i)
    ).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
