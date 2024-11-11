import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingModal } from "./loading-modal";

describe("LoadingModal", () => {
  it("should render the modal background", () => {
    render(<LoadingModal />);
    expect(screen.getByTestId("modal-background")).toBeInTheDocument();
  });

  it("should render the loading indicator", () => {
    render(<LoadingModal />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("should render the loading text", () => {
    render(<LoadingModal />);
    expect(screen.getByText("Loading....")).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(<LoadingModal />);
    expect(container).toMatchSnapshot();
  });
});
