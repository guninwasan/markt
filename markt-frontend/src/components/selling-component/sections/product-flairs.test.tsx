import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductFlairs } from "./product-flairs";

describe("ProductFlairs Component", () => {
  const mockHandleTagSelection = jest.fn();
  const formData = {
    flairs: ["Like New", "Free Shipping"],
  };

  beforeEach(() => {
    render(
      <ProductFlairs
        formData={formData}
        handleTagSelection={mockHandleTagSelection}
      />
    );
  });

  it("should render section header", () => {
    expect(screen.getByText("Product Flairs")).toBeInTheDocument();
  });

  it("should render all tags", () => {
    const tags = ["Like New", "Limited Edition", "Free Shipping", "Popular"];
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("should highlight selected tags", () => {
    const selectedTags = ["Like New", "Free Shipping"];
    selectedTags.forEach((tag) => {
      const tagElement = screen.getByText(tag);
      expect(tagElement).toHaveClass("selected");
    });
  });

  it("should call handleTagSelection when a tag is clicked", () => {
    const tagElement = screen.getByText("Limited Edition");
    fireEvent.click(tagElement);
    expect(mockHandleTagSelection).toHaveBeenCalledWith("Limited Edition");
  });
});
