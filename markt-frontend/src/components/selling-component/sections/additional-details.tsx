import React from "react";
import {
  FormGroup,
  Label,
  TextArea,
  SectionHeader,
} from "../selling-component.styles";

const AdditionalDetails = ({ formData, handleChange }: any) => (
  <>
    <SectionHeader data-testid="additional-details-section-header">
      Additional Details
    </SectionHeader>
    <FormGroup>
      <Label htmlFor="additionalDetails">Additional Details</Label>
      <TextArea
        id="additionalDetails"
        name="additionalDetails"
        placeholder="Add any extra information about the product"
        value={formData.additionalDetails}
        onChange={handleChange}
      />
    </FormGroup>
  </>
);

export { AdditionalDetails };
