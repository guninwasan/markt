import React, { useRef } from "react";
import {
  FormGroup,
  Label,
  AddMediaButton,
  SectionHeader,
  PreviewImagesContainer,
  RemoveButton,
  StyledImage,
  StyledVideo,
} from "../selling-component.styles";

type MediaSectionProps = {
  mediaFiles: File[];
  setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
  displayImage: File | null;
  setDisplayImage: React.Dispatch<React.SetStateAction<File | null>>;
};

const maxMediaFiles = 4;

const MediaSection = ({
  mediaFiles,
  setMediaFiles,
  displayImage,
  setDisplayImage,
}: MediaSectionProps) => {
  const displayImageInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const addDisplayImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      if (files[0].size > 1024 * 1024) {
        alert("Image size should not exceed 1MB.");
        return;
      }
      setDisplayImage(files[0]);
    }
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 1024 * 1024) {
        alert(`File ${file.name} exceeds the 1MB size limit.`);
        return false;
      }
      return true;
    });

    if (mediaFiles.length + validFiles.length > maxMediaFiles) {
      alert(`You can only upload up to ${maxMediaFiles} files.`);
      return;
    }

    setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...validFiles]);
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
          Add Display Image (Max 1 MB) *
        </AddMediaButton>
        <input
          id="displayImageInput"
          type="file"
          accept="image/*"
          onChange={addDisplayImage}
          style={{ display: "none" }}
          ref={displayImageInputRef}
          data-testid="displayImageInput"
        />
        {displayImage && (
          <PreviewImagesContainer>
            <StyledImage
              src={URL.createObjectURL(displayImage)}
              alt="display-preview"
            />
            <RemoveButton onClick={handleRemoveDisplay}>✕</RemoveButton>
          </PreviewImagesContainer>
        )}
        <br />
        <Label htmlFor="mediaInput">
          Additional Images and Videos (Max {maxMediaFiles} )
        </Label>
        <AddMediaButton
          type="button"
          onClick={() => mediaInputRef.current?.click()}
        >
          + Add Images or Videos (Max 1 MB)
        </AddMediaButton>
        <input
          id="mediaInput"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleMediaChange}
          style={{ display: "none" }}
          ref={mediaInputRef}
          data-testid="mediaInput"
        />
        <p>
          {mediaFiles.length} / {maxMediaFiles} files uploaded
        </p>
        {mediaFiles.map((file, index) => (
          <PreviewImagesContainer key={index}>
            {file.type.startsWith("image/") ? (
              <StyledImage
                src={URL.createObjectURL(file)}
                alt={`media-preview-${index + 1}`}
              />
            ) : file.type.startsWith("video/") ? (
              <StyledVideo controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
              </StyledVideo>
            ) : null}
            <RemoveButton onClick={() => handleRemoveMedia(index)}>
              ✕
            </RemoveButton>
          </PreviewImagesContainer>
        ))}
      </FormGroup>
    </>
  );
};

export { MediaSection };
