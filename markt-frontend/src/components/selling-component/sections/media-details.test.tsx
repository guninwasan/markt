import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MediaSection } from "./media-details";

describe("MediaSection Component", () => {
  const mockHandleAddMediaClick = jest.fn();
  const mockHandleAddMedia = jest.fn();
  const fileInputRef = React.createRef<HTMLInputElement>();
  const formData = {
    media: ["file1.jpg", "file2.png"],
  };

  beforeEach(() => {
    render(
      <MediaSection
        formData={formData}
        handleAddMediaClick={mockHandleAddMediaClick}
        handleAddMedia={mockHandleAddMedia}
        fileInputRef={fileInputRef}
      />
    );
  });

  it("should render section header", () => {
    expect(screen.getByText("Media")).toBeInTheDocument();
  });

  it("should render label", () => {
    expect(screen.getByText("Images and Videos")).toBeInTheDocument();
  });

  it("should render add media button", () => {
    const addMediaButton = screen.getByText("+ Add Images or Videos");
    expect(addMediaButton).toBeInTheDocument();
  });

  it("should display the correct number of uploaded files", () => {
    expect(screen.getByText("2 files uploaded")).toBeInTheDocument();
  });

  it("should call handleAddMediaClick when add media button is clicked", () => {
    const addMediaButton = screen.getByText("+ Add Images or Videos");
    fireEvent.click(addMediaButton);
    expect(mockHandleAddMediaClick).toHaveBeenCalled();
  });

  it("should call handleAddMedia when file input changes", () => {
    const fileInput = screen.getByLabelText("Images and Videos");
    fireEvent.change(fileInput, {
      target: { files: [new File([], "file3.jpg")] },
    });
    expect(mockHandleAddMedia).toHaveBeenCalled();
  });
});
