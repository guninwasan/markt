import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./navbar";
import { store } from "../../redux/store";
import { useIsMobile } from "../../hooks";

jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
}));

jest.mock("./menu-items", () => ({
  MenuItems: jest.fn(() => (
    <div data-testid="menu-items">
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
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );
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

  it("should toggle the sidebar when the hamburger is clicked", () => {
    renderNavbar(true);
    const hamburger = screen.getByTestId("hamburger");
    fireEvent.click(hamburger);
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
  });

  it("should close the sidebar when the backdrop is clicked", () => {
    renderNavbar(true);
    const hamburger = screen.getByTestId("hamburger");
    fireEvent.click(hamburger);
    const backdrop = screen.getByTestId("backdrop");
    fireEvent.click(backdrop);
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });
});
