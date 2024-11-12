import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { Profile } from "./profile";
import { renderWithRedux } from "../../utils/render-with-redux";
import { setIsLoading, setIsLoggedIn } from "../../redux";

jest.mock("../../redux", () => ({
  ...jest.requireActual("../../redux"),
  selectors: {
    getName: jest.fn(() => ""),
    getEmail: jest.fn(() => ""),
    getPhone: jest.fn(() => ""),
  },
  setIsLoading: jest.fn(),
  setIsLoggedIn: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("Profile", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("should render the profile component with user information", () => {
    renderWithRedux(<Profile />);

    expect(screen.getByText(/Profile Details/i)).toBeInTheDocument();
    expect(screen.getByText(/UofT Email Address:/i)).toBeInTheDocument();
    expect(screen.getByText(/UofT Student ID:/i)).toBeInTheDocument();
  });

  it("should handle logout correctly", () => {
    renderWithRedux(<Profile />);

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalledWith(setIsLoading(true));
    expect(mockDispatch).toHaveBeenCalledWith(setIsLoggedIn(false));
  });

  it("should match the snapshot", () => {
    const { container } = renderWithRedux(<Profile />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
