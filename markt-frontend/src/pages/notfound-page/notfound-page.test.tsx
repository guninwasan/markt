import React from "react";
import { render, screen } from "@testing-library/react";
import { NotFoundPage } from "./notfound-page";
import { renderWithRedux } from "../../utils/render-with-redux";

describe("NotFoundPage", () => {
  it("should render the NotFoundPage component correctly", () => {
    renderWithRedux(<NotFoundPage />);

    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Oops! It looks like the page you are looking for does not exist. Enjoy this game while we have you here!"
      )
    ).toBeInTheDocument();
    expect(screen.getByTitle("Dino Game")).toBeInTheDocument();
  });

  it("should focus the iframe element after the component mounts", () => {
    renderWithRedux(<NotFoundPage />);

    const iframeElement = screen.getByTitle("Dino Game");
    expect(document.activeElement).toBe(iframeElement);
  });


});
