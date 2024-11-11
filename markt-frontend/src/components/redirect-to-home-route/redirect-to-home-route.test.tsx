import React from "react";
import { render, screen } from "@testing-library/react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RedirectToHomeRoute } from "./redirect-to-home-route";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
}));

describe("RedirectToHomeRoute", () => {
  const mockUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render the passed element when the user is logged in", () => {
    mockUseSelector.mockReturnValue(true);
    const TestComponent = () => <div>Test Component</div>;
    render(<RedirectToHomeRoute element={<TestComponent />} />);
    expect(screen.queryByText("Test Component")).not.toBeInTheDocument();
  });

  it("should render the passed element when the user is not logged in", () => {
    mockUseSelector.mockReturnValue(false);
    const TestComponent = () => <div>Test Component</div>;
    render(<RedirectToHomeRoute element={<TestComponent />} />);
    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });

  it("should call useSelector with the correct selector", () => {
    mockUseSelector.mockReturnValue(true);
    render(<RedirectToHomeRoute element={<div>Test Component</div>} />);
    expect(mockUseSelector).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should redirect to home when the user is logged in", () => {
    mockUseSelector.mockReturnValue(true);
    render(<RedirectToHomeRoute element={<div>Test Component</div>} />);
    expect(Navigate).toHaveBeenCalledWith({ to: "/", replace: true }, {});
  });
});
