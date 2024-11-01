import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./navbar";
import { store } from "../../redux/store";
import { useIsMobile } from "../../hooks";
import { renderWithRedux } from "../../utils/render-with-redux";
import { MenuItems } from "./menu-items";

jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
}));

jest.mock("./menu-items", () => ({
  MenuItems: jest.fn(() => (
    <div>
      <>Home</>
      <>Buy</>
      <>Sell</>
    </div>
  )),
}));

describe("Navbar", () => {
  const mockUseIsMobile = useIsMobile as jest.Mock;

  const renderNavbar = (isMobile = false) => {
    mockUseIsMobile.mockReturnValue({ isMobile });
    return renderWithRedux(<Navbar />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the navbar container", () => {
    renderNavbar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should display the Markt name", () => {
    renderNavbar();
    const marktText = screen.getByText(/Markt/i);
    expect(marktText).toBeInTheDocument();
  });

  it("should match the snapshot on desktop", () => {
    const { container } = renderNavbar();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match the snapshot on mobile", () => {
    const { container } = renderNavbar(true);
    expect(container.firstChild).toMatchSnapshot();
  });
});
