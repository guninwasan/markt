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
      <Label>Images and Videos</Label>
      <AddMediaButton type="button" onClick={handleAddMediaClick}>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleAddMedia}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        + Add Images or Videos
      </AddMediaButton>
      <p>{formData.media.length} files selected</p>
    </FormGroup>
  </>
);

export { MediaSection };
