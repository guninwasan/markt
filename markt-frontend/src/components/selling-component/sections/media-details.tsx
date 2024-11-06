import React, { useState, useRef } from "react";
import {
  FormGroup,
  Label,
  AddMediaButton,
  SectionHeader,
  PreviewImagesContainer,
  RemoveButton,
} from "../selling-component.styles";

const MediaSection = ({
  formData,
  handleAddMedia,
  displayImage,
  setDisplayImage,
}: any) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>(
    formData.media.slice(1) || []
  );
  const displayImageInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const addDisplayImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      setDisplayImage(files[0]);
      handleAddMedia(event);
    }
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (mediaFiles.length + files.length > 7) {
      alert("You can only upload up to 7 files.");
      return;
    }
    setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...files]);
    handleAddMedia(event);
  };

  const handleRemoveDisplay = () => {
    if (window.confirm("Are you sure you want to remove the display image?")) {
      setDisplayImage(null);
    }
  };

  const handleRemoveMedia = (index: number) => {
    if (window.confirm("Are you sure you want to remove this media file?")) {
      setMediaFiles((prevMediaFiles) => [
        ...prevMediaFiles.slice(0, index),
        ...prevMediaFiles.slice(index + 1),
      ]);
    }
  };

  return (
    <>
      <SectionHeader>Media</SectionHeader>
      <FormGroup>
        <Label htmlFor="displayImage">Display Image *</Label>
        <AddMediaButton
          type="button"
          onClick={() => displayImageInputRef.current?.click()}
        >
          Add Display Image
        </AddMediaButton>
        <input
          id="displayImageInput"
          type="file"
          accept="image/*"
          onChange={addDisplayImage}
          style={{ display: "none" }}
          ref={displayImageInputRef}
        />
        {displayImage && (
          <PreviewImagesContainer>
            {displayImage.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(displayImage)}
                alt="display-preview"
                width="100"
              />
            ) : null}
            <RemoveButton type="button" onClick={handleRemoveDisplay}>
              Remove Display Image
            </RemoveButton>
          </PreviewImagesContainer>
        )}

        <Label htmlFor="mediaInput">
          Additional Images and Videos (Max: 7)
        </Label>
        <AddMediaButton
          type="button"
          onClick={() => mediaInputRef.current?.click()}
        >
          + Add Images or Videos
        </AddMediaButton>
        <input
          id="mediaInput"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleMediaChange}
          style={{ display: "none" }}
          ref={mediaInputRef}
        />
        <p>{mediaFiles.length} / 7 files uploaded</p>
        {mediaFiles.map((file, index) => (
          <PreviewImagesContainer key={index}>
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`media-preview-${index + 1}`}
                width="100"
              />
            ) : file.type.startsWith("video/") ? (
              <video width="100" controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            ) : null}
            <RemoveButton
              type="button"
              onClick={() => handleRemoveMedia(index)}
            >
              Remove
            </RemoveButton>
          </PreviewImagesContainer>
        ))}
      </FormGroup>
    </>
  );
};

export { MediaSection };
