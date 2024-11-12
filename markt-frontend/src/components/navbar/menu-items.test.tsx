import { fireEvent, screen } from "@testing-library/react";
import { MenuItems } from "./menu-items";
import { setIsLoggedIn, store } from "../../redux";
import { renderWithRedux } from "../../utils/render-with-redux";
import { useIsMobile } from "../../hooks";

// Mock useIsMobile hook
jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
}));

describe("MenuItems Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render login/register link when user is not logged in", () => {
    (useIsMobile as jest.Mock).mockReturnValue({ isMobile: false });
    store.dispatch(setIsLoggedIn(false));
    renderWithRedux(<MenuItems />);
    expect(screen.getByText("Login/Register")).toBeInTheDocument();
  });

  it("should render mobile menu items when logged in on mobile", () => {
    store.dispatch(setIsLoggedIn(true));
    (useIsMobile as jest.Mock).mockReturnValue({ isMobile: true });

    renderWithRedux(<MenuItems />);

    expect(screen.getByText("Sell")).toBeInTheDocument();
    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should render desktop menu items with dropdown when logged in on desktop", () => {
    store.dispatch(setIsLoggedIn(true));
    (useIsMobile as jest.Mock).mockReturnValue({ isMobile: false });

    renderWithRedux(<MenuItems />);

    expect(screen.getByText("Sell")).toBeInTheDocument();
    const profileButton = screen.getByTestId("profile");
    expect(profileButton).toBeInTheDocument();
  });

  it("should show and hide dropdown menu on profile button click", () => {
    store.dispatch(setIsLoggedIn(true));
    (useIsMobile as jest.Mock).mockReturnValue({ isMobile: false });

    renderWithRedux(<MenuItems />);
    const profileButton = screen.getByTestId("profile");

    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should close dropdown when clicking outside of it", () => {
    store.dispatch(setIsLoggedIn(true));
    (useIsMobile as jest.Mock).mockReturnValue({ isMobile: false });

    renderWithRedux(<MenuItems />);
    const profileButton = screen.getByTestId("profile");

    fireEvent.click(profileButton);
    expect(screen.getByText("My Profile")).toBeInTheDocument();

    fireEvent.mouseDown(document);
    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();
  });
});
