import { useState } from "react";
import {
  SellingFormContainer,
  SectionHeader,
  FormGroup,
  Label,
  TextInput,
  TextArea,
  AddMediaButton,
  TagContainer,
  Tag,
  Button,
} from "./selling-component.styles";

const initialFormData = {
  title: "",
  price: "",
  description: "",
  negotiable: false,
  condition: "",
  flairs: [],
  media: [],
  brand: "",
  model: "",
  yearOfManufacture: "",
  color: "",
  dimensions: "",
  weight: "",
  material: "",
  batteryLife: "",
  storageCapacity: "",
  additionalFeatures: "",
  additionalDetails: "",
};

const SellingComponent = () => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [priceError, setPriceError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prevData: any) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (type === "file") {
      const { files } = e.target as HTMLInputElement;
      if (files) {
        setFormData((prevData: any) => ({
          ...prevData,
          media: [...prevData.media, ...Array.from(files)],
        }));
      }
    } else {
      setFormData((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleTagSelection = (tag: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      flairs: prevData.flairs.includes(tag)
        ? prevData.flairs.filter((flair: any) => flair !== tag)
        : [...prevData.flairs, tag],
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const priceAsNumber = parseFloat(value);
    if (!isNaN(priceAsNumber) && priceAsNumber >= 0) {
      setPriceError("");
      setFormData((prevData: any) => ({ ...prevData, price: value }));
    } else {
      setPriceError("Please enter a valid positive number for price.");
    }
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prevData: any) => ({
        ...prevData,
        media: [...prevData.media, ...Array.from(files)],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }
    if (priceError) {
      alert("Please correct the errors in the form.");
      return;
    }
    alert("Form Data Submitted");
    // connect with backend
  };

  return (
    <SellingFormContainer>
      <h1>List Your Product</h1>
      <form onSubmit={handleSubmit}>
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

        <SectionHeader>Media</SectionHeader>
        <FormGroup>
          <Label>Images and Videos</Label>
          <AddMediaButton type="button">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleAddMedia}
              style={{ display: "none" }}
            />
            + Add Images or Videos
          </AddMediaButton>
          <p>{formData.media.length} files selected</p>
        </FormGroup>

        <SectionHeader>Product Flairs</SectionHeader>
        <TagContainer>
          {["Like New", "Limited Edition", "Free Shipping", "Popular"].map(
            (tag) => (
              <Tag
                key={tag}
                selected={formData.flairs.includes(tag)}
                onClick={() => handleTagSelection(tag)}
              >
                {tag}
              </Tag>
            )
          )}
        </TagContainer>

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

        <Button type="submit">Post Listing</Button>
      </form>
    </SellingFormContainer>
  );
};

export { SellingComponent };
