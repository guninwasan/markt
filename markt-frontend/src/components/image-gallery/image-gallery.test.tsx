import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageGallery } from "./image-gallery";

const mediaUrls = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
];

describe("ImageGallery", () => {
  it("should render thumbnails", () => {
    render(<ImageGallery mediaUrls={mediaUrls} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("should open modal on thumbnail click", () => {
    render(<ImageGallery mediaUrls={mediaUrls} />);

    fireEvent.click(screen.getAllByRole("img")[0]);
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  it("should close modal on close button click", () => {
    render(<ImageGallery mediaUrls={mediaUrls} />);

    fireEvent.click(screen.getAllByRole("img")[0]);
    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("✕")).not.toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<ImageGallery mediaUrls={mediaUrls} />);
    expect(container).toMatchSnapshot();
  });

  it("should navigate to next image", () => {
    render(<ImageGallery mediaUrls={mediaUrls} />);
    fireEvent.click(screen.getAllByRole("img")[0]);

    const nextButton = screen.getByTestId("next");
    expect(nextButton).toBeInTheDocument();

    const getFirstImageIndex = screen.getByText("1/2");
    expect(getFirstImageIndex).toBeInTheDocument();
    fireEvent.click(nextButton);

    const getSecondImageIndex = screen.getByText("2/2");
    expect(getSecondImageIndex).toBeInTheDocument();
  });

  it("should navigate to previous image", () => {
    render(<ImageGallery mediaUrls={mediaUrls} />);
    fireEvent.click(screen.getAllByRole("img")[1]);

    const prevButton = screen.getByTestId("prev");
    expect(prevButton).toBeInTheDocument();

    const getSecondImageIndex = screen.getByText("2/2");
    expect(getSecondImageIndex).toBeInTheDocument();
    fireEvent.click(prevButton);

    const getFirstImageIndex = screen.getByText("1/2");
    expect(getFirstImageIndex).toBeInTheDocument();
  });
});
