import React from "react";
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
}: any) => (
  <>
    <SectionHeader>Media</SectionHeader>
    <FormGroup>
      <Label htmlFor="mediaInput">Images and Videos</Label>
      <AddMediaButton type="button" onClick={handleAddMediaClick}>
        <input
          id="mediaInput"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleAddMedia}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        + Add Images or Videos
      </AddMediaButton>
      <p>{formData.media.length} files uploaded</p>
    </FormGroup>
  </>
);

export { MediaSection };
