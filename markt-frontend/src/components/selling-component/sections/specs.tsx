import React from "react";
import {
  FormGroup,
  Label,
  TextInput,
  SectionHeader,
} from "../selling-component.styles";

const Specifications = ({ formData, handleChange }: any) => (
  <>
    <SectionHeader>Specifications (Optional)</SectionHeader>
    {[
      "brand",
      "model",
      "yearOfManufacture",
      "color",
      "dimensions",
      "weight",
      "material",
      "batteryLife",
      "storageCapacity",
    ].map((spec) => (
      <FormGroup key={spec}>
        <Label>{spec.charAt(0).toUpperCase() + spec.slice(1)}</Label>
        <TextInput
          type="text"
          name={spec}
          placeholder={`Enter ${spec}`}
          value={formData[spec] || ""}
          onChange={handleChange}
        />
      </FormGroup>
    ))}
  </>
);

export { Specifications };
