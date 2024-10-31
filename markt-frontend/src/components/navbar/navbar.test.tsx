import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import { Navbar } from "./navbar";
import { store } from "../../redux/store";
import { useIsMobile } from "../../hooks";
import { renderWithRedux } from "../../utils/render-with-redux";

jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
}));

describe("Navbar", () => {
  const mockUseIsMobile = useIsMobile as jest.Mock;

  beforeEach(() => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the navbar properly", () => {
    renderWithRedux(<Navbar />);
    expect(document.querySelector("nav")).toBeInTheDocument();
  });

  it("should render the Markt name", () => {
    renderWithRedux(<Navbar />);
    const marktText = screen.getByText(/Markt/i);
    expect(marktText).toBeInTheDocument();
  });

  it("should render the Home, Buy, Sell link", () => {
    renderWithRedux(<Navbar />);
    const homeLink = screen.getByText(/Home/i);
    const buyLink = screen.getByText(/Buy/i);
    const sellLink = screen.getByText(/Sell/i);
    expect(homeLink).toBeInTheDocument();
    expect(buyLink).toBeInTheDocument();
    expect(sellLink).toBeInTheDocument();
  });
});
