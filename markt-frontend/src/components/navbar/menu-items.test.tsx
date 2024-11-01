import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MenuItems } from "./menu-items";
import { useIsMobile } from "../../hooks";
import { renderWithRouter } from "../../utils/render-with-router";

jest.mock("../../hooks", () => ({
  useIsMobile: jest.fn(),
}));

describe("MenuItems", () => {
  const mockUseIsMobile = useIsMobile as jest.Mock;

  const renderMenuItems = (initialEntries = ["/"]) => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="*" element={<MenuItems />} />
        </Routes>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all menu items", () => {
    renderMenuItems();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Buy")).toBeInTheDocument();
    expect(screen.getByText("Sell")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Login/Register")).toBeInTheDocument();
  });

  it("should apply active class to the active link", () => {
    renderMenuItems(["/buy"]);
    const activeLink = screen.getByText("Buy");
    expect(activeLink).toHaveClass("active");
  });

  it("should not apply active class to inactive links", () => {
    renderMenuItems(["/buy"]);
    const inactiveLink = screen.getByText("Home");
    expect(inactiveLink).not.toHaveClass("active");
  });

  it("should not apply active class to other links when one is active", () => {
    renderMenuItems(["/buy"]);
    const buyLink = screen.getByText("Buy");
    expect(buyLink).toHaveClass("active");

    const homeLink = screen.getByText("Home");
    expect(homeLink).not.toHaveClass("active");

    const sellLink = screen.getByText("Sell");
    expect(sellLink).not.toHaveClass("active");

    const wishlistLink = screen.getByText("Wishlist");
    expect(wishlistLink).not.toHaveClass("active");

    const registerLink = screen.getByText("Login/Register");
    expect(registerLink).not.toHaveClass("active");
  });
});
