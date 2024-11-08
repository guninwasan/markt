import React from "react";
import { render } from "@testing-library/react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "./protected-route";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
}));

describe("ProtectedRoute", () => {
  const mockUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the passed element when the user is logged in", () => {
    mockUseSelector.mockReturnValue(true);
    const TestComponent = () => <div>Test Component</div>;
    const { getByText } = render(
      <ProtectedRoute element={<TestComponent />} />
    );
    expect(getByText("Test Component")).toBeInTheDocument();
  });

  it("should not render the passed element when the user is not logged in", () => {
    mockUseSelector.mockReturnValue(false);
    const TestComponent = () => <div>Test Component</div>;
    const { queryByText } = render(
      <ProtectedRoute element={<TestComponent />} />
    );
    expect(queryByText("Test Component")).not.toBeInTheDocument();
  });

  it("should call useSelector with the correct selector", () => {
    mockUseSelector.mockReturnValue(true);
    render(<ProtectedRoute element={<div>Test Component</div>} />);
    expect(mockUseSelector).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should redirect to login when the user is not logged in", () => {
    mockUseSelector.mockReturnValue(false);
    render(<ProtectedRoute element={<div>Test Component</div>} />);
    expect(Navigate).toHaveBeenCalledWith({ to: "/login", replace: true }, {});
  });
});
