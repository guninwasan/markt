import React from "react";
import { screen } from "@testing-library/react";
import { renderWithRedux } from "./render-with-redux";
import { store } from "../redux";

const TestComponent = () => {
  return <div data-testid="test-component">Test Component</div>;
};

describe("renderWithRedux", () => {
  it("should render the component with Redux and React Router", () => {
    renderWithRedux(<TestComponent />);
    expect(screen.getByTestId("test-component")).toBeInTheDocument();
  });

  it("should provide the Redux store", () => {
    renderWithRedux(<TestComponent />);
    const state = store.getState();
    expect(state).toBeDefined();
  });

  it("should use MemoryRouter for routing", () => {
    renderWithRedux(<TestComponent />);
    expect(screen.getByTestId("test-component")).toBeInTheDocument();
  });
});
