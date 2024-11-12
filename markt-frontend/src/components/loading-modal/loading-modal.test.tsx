import React from "react";
import { screen, act } from "@testing-library/react";
import { LoadingModal } from "./loading-modal";
import { renderWithRedux } from "../../utils/render-with-redux";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

const thingsTakingLongerThanUsualMessage =
  "Things are taking longer than usual...";

describe("LoadingModal", () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockReturnValue({ isLoading: true });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render the modal background", () => {
    renderWithRedux(<LoadingModal />);
    expect(screen.getByTestId("modal-background")).toBeInTheDocument();
  });

  it("should render the loading indicator", () => {
    renderWithRedux(<LoadingModal />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("should render the loading text", () => {
    renderWithRedux(<LoadingModal />);
    expect(screen.getByText("Loading....")).toBeInTheDocument();
  });

  it("should display thingsTakingLongerThanUsualMessage after 10 seconds", () => {
    renderWithRedux(<LoadingModal />);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(
      screen.getByText(thingsTakingLongerThanUsualMessage)
    ).toBeInTheDocument();
  });

  it("should display contactSupportMessage after 20 seconds", () => {
    renderWithRedux(<LoadingModal />);
    act(() => {
      jest.advanceTimersByTime(20000);
    });
    expect(
      screen.getByText(/Still no luck\? Try contacting support/)
    ).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = renderWithRedux(<LoadingModal />);
    expect(container).toMatchSnapshot();
  });
});
