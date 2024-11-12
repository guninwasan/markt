import React from "react";
import {
  FormGroup,
  Label,
  TextInput,
  TextArea,
  SectionHeader,
  DropDown,
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
      <DropDown
        name="pickupLocation"
        required
        value={formData.pickupLocation}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a pickup location....
        </option>
        <option value="St. George - Bahen">St. George - Bahen</option>
        <option value="St. George - Myhal">St. George - Myhal</option>
        <option value="St. George - GB">St. George - GB</option>
        <option value="St. George - SF">St. George - SF</option>
        <option value="UTM">UTM</option>
        <option value="UTSC">UTSC</option>
      </DropDown>
    </FormGroup>
  </>
);

export { EssentialDetails };
