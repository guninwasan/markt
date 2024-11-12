import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MediaSection } from "./media-details";

const createFile = (name: string, type: string, sizeInKB: number): File => {
  return new File([new Array(sizeInKB * 1024).fill("a").join("")], name, {
    type,
  });
};

const createImageFile = (sizeInKB: number): File => {
  return createFile("test-image.jpg", "image/jpeg", sizeInKB);
};

describe("MediaSection Component", () => {
  const mockSetMediaFiles = jest.fn();
  const mockSetDisplayImage = jest.fn();
  const maxMediaFiles = 4;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mocked-url");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MediaSection
        mediaFiles={[]}
        setMediaFiles={mockSetMediaFiles}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

  it("should render component correctly", () => {
    renderComponent();
    expect(screen.getByText(/Media/)).toBeInTheDocument();
    expect(screen.getByText(/Add Display Image/)).toBeInTheDocument();
    expect(screen.getByText(/Add Images or Videos/)).toBeInTheDocument();
  });

  it("should add display image if file size is within limit", async () => {
    renderComponent();
    const file = createImageFile(500);
    const input = screen.getByTestId("displayImageInput");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockSetDisplayImage).toHaveBeenCalledWith(file);
    });
  });

  it("should show alert if display image exceeds 1 MB", () => {
    renderComponent();
    const file = createImageFile(1500);
    const input = screen.getByTestId("displayImageInput");
    window.alert = jest.fn();
    fireEvent.change(input, { target: { files: [file] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Image size should not exceed 1MB."
    );
    expect(mockSetDisplayImage).not.toHaveBeenCalled();
  });

  it("should add media file if file size is within limit", async () => {
    renderComponent();
    const file = createImageFile(500);
    const input = screen.getByTestId("mediaInput");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockSetMediaFiles).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it("should show alert if adding media files exceeds max limit", () => {
    const existingFiles = Array.from({ length: maxMediaFiles }, () =>
      createImageFile(500)
    );
    render(
      <MediaSection
        mediaFiles={existingFiles}
        setMediaFiles={mockSetMediaFiles}
        displayImage={null}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    const file = createImageFile(500);
    const input = screen.getByTestId("mediaInput");
    window.alert = jest.fn();
    fireEvent.change(input, { target: { files: [file] } });

    expect(window.alert).toHaveBeenCalledWith(
      `You can only upload up to ${maxMediaFiles} files.`
    );
    expect(mockSetMediaFiles).not.toHaveBeenCalled();
  });

  it("should remove display image after confirmation", () => {
    const displayImage = createImageFile(500);

    render(
      <MediaSection
        mediaFiles={[]}
        setMediaFiles={mockSetMediaFiles}
        displayImage={displayImage}
        setDisplayImage={mockSetDisplayImage}
      />
    );

    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText("✕"));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to remove the display image?"
    );
    expect(mockSetDisplayImage).toHaveBeenCalledWith(null);
  });

  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
