import React, { useState } from "react";
import {
  FormGroup,
  Label,
  AddMediaButton,
  SectionHeader,
} from "../selling-component.styles";

const MediaSection = ({
  formData,
  handleAddMediaClick,
  handleAddMedia,
  fileInputRef,
}: any) => {
  const [mediaFiles, setMediaFiles] = useState(formData.media || []);

  const displayMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaFiles([...files, ...mediaFiles]);
    handleAddMedia(event);
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaFiles([...mediaFiles, ...files]);
    handleAddMedia(event);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(({ prevMediaFiles }: any) => [
      ...prevMediaFiles.slice(0, index),
      ...prevMediaFiles.slice(index + 1),
    ]);
  };

  return (
    <>
      <SectionHeader>Media</SectionHeader>
      <FormGroup>
        <Label htmlFor="displayImage">Display Image *</Label>
        <AddMediaButton type="button" onClick={handleAddMediaClick}>
          <input
            id="mediaInput"
            type="file"
            multiple
            accept="image/*"
            onChange={displayMediaChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          Add Display Image
        </AddMediaButton>
        <div>
          {mediaFiles.map((file: File, index: number) => (
            <div key={index}>
              {file && file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`media-preview-${index}`}
                  width="100"
                />
              ) : file && file.type.startsWith("video/") ? (
                <video width="100" controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                </video>
              ) : null}
              <button type="button" onClick={() => handleRemoveMedia(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <Label htmlFor="mediaInput">Images and Videos</Label>
        <AddMediaButton type="button" onClick={handleAddMediaClick}>
          <input
            id="mediaInput"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          + Add Images or Videos
        </AddMediaButton>
        <p>{mediaFiles.length} files uploaded</p>
        <div>
          {mediaFiles.map((file: File, index: number) => (
            <div key={index}>
              {file && file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`media-preview-${index}`}
                  width="100"
                />
              ) : file && file.type.startsWith("video/") ? (
                <video width="100" controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                </video>
              ) : null}
              <button type="button" onClick={() => handleRemoveMedia(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </FormGroup>
    </>
  );
};

export { MediaSection };
