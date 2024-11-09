import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MediaSection } from "./media-details";

global.URL.createObjectURL = jest.fn(() => "mock-url");

const maxMediaFiles = 4;

describe("MediaSection", () => {
  const mockSetMediaFiles = jest.fn();
  const mockSetDisplayImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow removing an additional media file", () => {
    const mockMediaFiles = [
      new File(["media1"], "media1.jpg", { type: "image/jpeg" }),
      new File(["media2"], "media2.jpg", { type: "image/jpeg" }),
    ];

    render(
      <MediaSection
        mediaFiles={mockMediaFiles}
        setMediaFiles={mockSetMediaFiles}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const removeButton = screen.getAllByText("✕")[0];
    window.confirm = jest.fn(() => true);

    fireEvent.click(removeButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to remove this media file?"
    );
  });

  it("should display the correct number of uploaded media files", () => {
    const mockMediaFiles = [
      new File(["media1"], "media1.jpg", { type: "image/jpeg" }),
      new File(["media2"], "media2.jpg", { type: "image/jpeg" }),
    ];

    render(
      <MediaSection
        mediaFiles={mockMediaFiles}
        setMediaFiles={mockSetMediaFiles}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    expect(
      screen.getByText(`2 / ${maxMediaFiles} files uploaded`)
    ).toBeInTheDocument();
  });

  it("should display preview of uploaded image files", () => {
    const mockMediaFiles = [
      new File(["media1"], "media1.jpg", { type: "image/jpeg" }),
    ];

    render(
      <MediaSection
        mediaFiles={mockMediaFiles}
        setMediaFiles={mockSetMediaFiles}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const imagePreview = screen.getByAltText("media-preview-1");
    expect(imagePreview).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <MediaSection
        mediaFiles={[]}
        setMediaFiles={mockSetMediaFiles}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
