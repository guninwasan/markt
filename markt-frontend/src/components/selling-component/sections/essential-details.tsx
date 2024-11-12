import React from "react";
import {
  FormGroup,
  Label,
  TextInput,
  TextArea,
  SectionHeader,
} from "../selling-component.styles";

const EssentialDetails = ({
  formData,
  handleChange,
  handlePriceChange,
  priceError,
}: any) => (
  <>
    <SectionHeader>Essential Details</SectionHeader>
    <FormGroup style={{ flex: "1 1 45%" }}>
      <Label>Title *</Label>
      <TextInput
        type="text"
        name="title"
        required
        placeholder="Enter the product title"
        value={formData.title}
        onChange={handleChange}
      />
    </FormGroup>
    <FormGroup style={{ flex: "1 1 45%" }}>
      <Label>Price (CAD) *</Label>
      <TextInput
        type="text"
        name="price"
        required
        placeholder="Enter the product price"
        value={formData.price}
        onChange={handlePriceChange}
      />
      {priceError && <p style={{ color: "red" }}>{priceError}</p>}
    </FormGroup>
    <FormGroup>
      <Label>
        <input
          type="checkbox"
          name="negotiable"
          checked={formData.negotiable}
          onChange={handleChange}
        />
        Price Negotiable
      </Label>
    </FormGroup>
    <FormGroup>
      <Label>Description *</Label>
      <TextArea
        name="description"
        required
        placeholder="Provide a detailed description of the item..."
        value={formData.description}
        onChange={handleChange}
      />
    </FormGroup>
    <FormGroup>
      <Label>Pickup Location *</Label>
      <TextArea
        name="pickupLocation"
        required
        placeholder="Provide a pickup location..."
        value={formData.pickupLocation}
        onChange={handleChange}
      />
    </FormGroup>
  </>
);

export { EssentialDetails };
