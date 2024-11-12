import React from "react";
import {
  FormGroup,
  Label,
  TextInput,
  SectionHeader,
} from "../selling-component.styles";

type SpecificationsProps = {
  formData: {
    brand?: string;
    model?: string;
    yearOfManufacture?: string;
    color?: string;
    dimensions?: string;
    weight?: string;
    material?: string;
    batteryLife?: string;
    storageCapacity?: string;
  };
  handleChange: any;
};

const Specifications: React.FC<SpecificationsProps> = ({
  formData,
  handleChange,
}) => (
  <>
    <SectionHeader>Specifications (Optional)</SectionHeader>
    {[
      "brand",
      "model",
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
          value={formData[spec as keyof SpecificationsProps["formData"]] || ""}
          onChange={handleChange}
          maxLength={190}
        />
      </FormGroup>
    ))}
  </>
);

export { Specifications };
