import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MediaSection } from "./media-details";

const mockFormData = { media: [] };
const mockHandleAddMedia = jest.fn();
const mockSetDisplayImage = jest.fn();

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-url");
});

describe("MediaSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render MediaSection with initial elements", () => {
    render(
      <MediaSection
        formData={mockFormData}
        handleAddMedia={mockHandleAddMedia}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    expect(screen.getByText("Media")).toBeInTheDocument();
    expect(screen.getByText("Add Display Image")).toBeInTheDocument();
    expect(
      screen.getByText("Additional Images and Videos (Max: 7)")
    ).toBeInTheDocument();
    expect(screen.getByText("+ Add Images or Videos")).toBeInTheDocument();
    expect(screen.getByText("0 / 7 files uploaded")).toBeInTheDocument();
  });

  it("should allow adding a display image", () => {
    render(
      <MediaSection
        formData={mockFormData}
        handleAddMedia={mockHandleAddMedia}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const displayImageInput = screen.getByTestId("displayImageInput");
    const displayImageFile = new File(["display"], "display.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(displayImageInput, {
      target: { files: [displayImageFile] },
    });

    expect(mockSetDisplayImage).toHaveBeenCalledWith(displayImageFile);
    expect(mockHandleAddMedia).toHaveBeenCalledTimes(1);
  });

  it("should allow adding up to 7 additional media files", () => {
    render(
      <MediaSection
        formData={mockFormData}
        handleAddMedia={mockHandleAddMedia}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const mediaInput = screen.getByTestId("mediaInput");
    const mediaFiles = [
      new File(["media1"], "media1.jpg", { type: "image/jpeg" }),
      new File(["media2"], "media2.jpg", { type: "image/jpeg" }),
      new File(["media3"], "media3.jpg", { type: "image/jpeg" }),
      new File(["media4"], "media4.jpg", { type: "image/jpeg" }),
      new File(["media5"], "media5.jpg", { type: "image/jpeg" }),
      new File(["media6"], "media6.jpg", { type: "image/jpeg" }),
      new File(["media7"], "media7.jpg", { type: "image/jpeg" }),
    ];

    fireEvent.change(mediaInput, { target: { files: mediaFiles } });

    expect(mockHandleAddMedia).toHaveBeenCalledTimes(1);
    expect(screen.getByText("7 / 7 files uploaded")).toBeInTheDocument();
  });

  it("should prevent adding more than 7 media files", () => {
    render(
      <MediaSection
        formData={mockFormData}
        handleAddMedia={mockHandleAddMedia}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const mediaInput = screen.getByTestId("mediaInput");
    const mediaFiles = [
      new File(["media1"], "media1.jpg", { type: "image/jpeg" }),
      new File(["media2"], "media2.jpg", { type: "image/jpeg" }),
      new File(["media3"], "media3.jpg", { type: "image/jpeg" }),
      new File(["media4"], "media4.jpg", { type: "image/jpeg" }),
      new File(["media5"], "media5.jpg", { type: "image/jpeg" }),
      new File(["media6"], "media6.jpg", { type: "image/jpeg" }),
      new File(["media7"], "media7.jpg", { type: "image/jpeg" }),
      new File(["media8"], "media8.jpg", { type: "image/jpeg" }),
    ];

    window.alert = jest.fn();
    fireEvent.change(mediaInput, { target: { files: mediaFiles } });

    expect(window.alert).toHaveBeenCalledWith(
      "You can only upload up to 7 files."
    );
    expect(mockHandleAddMedia).toHaveBeenCalledTimes(0);
  });

  it("should allow removing the display image", () => {
    render(
      <MediaSection
        formData={mockFormData}
        handleAddMedia={mockHandleAddMedia}
        displayImage={
          new File(["display"], "display.jpg", { type: "image/jpeg" })
        }
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const removeButton = screen.getByText("✕");
    window.confirm = jest.fn(() => true);

    fireEvent.click(removeButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to remove the display image?"
    );
    expect(mockSetDisplayImage).toHaveBeenCalledWith(null);
  });
});
