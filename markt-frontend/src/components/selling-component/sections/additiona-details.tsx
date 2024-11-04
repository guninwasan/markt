import React from "react";
import {
  FormGroup,
  Label,
  TextArea,
  SectionHeader,
} from "../selling-component.styles";

const AdditionalDetails = ({ formData, handleChange }: any) => (
  <>
    <SectionHeader>Additional Details</SectionHeader>
    <FormGroup>
      <Label>Additional Details</Label>
      <TextArea
        name="additionalDetails"
        placeholder="Add any extra information about the product"
        value={formData.additionalDetails}
        onChange={handleChange}
      />
    </FormGroup>
  </>
);

export { AdditionalDetails };
