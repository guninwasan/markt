import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { ListingContainer } from "./listing-container";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("ListingContainer", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockReset();
  });

  const renderListingContainer = () => {
    return render(
      <MemoryRouter>
        <ListingContainer {...defaultProps} />
      </MemoryRouter>
    );
  };

  const defaultProps = {
    id: "1",
    image: "test-image.jpg",
    title: "Test Title",
    price: "$100",
    condition: "New",
    location: "Test Location",
  };

  it("should render correctly with given props", () => {
    renderListingContainer();

    expect(screen.getByAltText("Test Title")).toHaveAttribute(
      "src",
      "test-image.jpg"
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = renderListingContainer();
    expect(container).toMatchSnapshot();
  });

  it("should navigate to listing page on click", () => {
    renderListingContainer();

    fireEvent.click(screen.getByTestId("listingContainer"));
    expect(mockNavigate).toHaveBeenCalledWith("/listing?id=1");
  });

  it("should toggle wishlist state on wishlist icon click", () => {
    renderListingContainer();

    const wishlistIcon = screen.getByTestId("wishlist-button");
    fireEvent.click(wishlistIcon);
    expect(wishlistIcon).toHaveClass("wishlist-icon-active");

    fireEvent.click(wishlistIcon);
    expect(wishlistIcon).not.toHaveClass("wishlist-icon-active");
  });
});
