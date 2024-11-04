import { useState } from "react";
import {
  SellingFormContainer,
  SectionHeader,
  FormRow,
  FormGroup,
  Label,
  TextInput,
  TextArea,
  AddMediaButton,
  TagContainer,
  Tag,
  Button,
} from "./selling-component.styles";

type FormData = {
  title: string;
  price: string;
  description: string;
  negotiable: boolean;
  condition: string;
  flairs: string[];
  media: File[];
  brand: string;
  model: string;
  yearOfManufacture: string;
  color: string;
  dimensions: string;
  weight: string;
  material: string;
  batteryLife: string;
  storageCapacity: string;
  additionalFeatures: string;
};

const initialFormData: FormData = {
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
};

const SellingComponent = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files
            ? Array.from(files)
            : prevData.media
          : value,
    }));
  };

  const handleTagSelection = (tag: string) => {
    setFormData((prevData) => ({
      ...prevData,
      flairs: prevData.flairs.includes(tag)
        ? prevData.flairs.filter((flair) => flair !== tag)
        : [...prevData.flairs, tag],
    }));
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        media: [...prevData.media, ...Array.from(e.target.files)],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form validation logic here
    if (!formData.title || !formData.price || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Form Data Submitted:", formData);
  };

  return (
    <SellingFormContainer>
      <h1>List Your Product</h1>
      <form onSubmit={handleSubmit}>
        <SectionHeader>Essential Details</SectionHeader>
        <FormRow>
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
              type="number"
              name="price"
              required
              placeholder="Enter the product price"
              value={formData.price}
              onChange={handleChange}
            />
          </FormGroup>
        </FormRow>

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
        </FormGroup>

        <SectionHeader>Product Flairs</SectionHeader>
        <TagContainer>
          {[
            "Like New",
            "Best Seller",
            "Limited Edition",
            "Free Shipping",
            "Popular",
          ].map((tag) => (
            <Tag
              key={tag}
              selected={formData.flairs.includes(tag)}
              onClick={() => handleTagSelection(tag)}
            >
              {tag}
            </Tag>
          ))}
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
              value={formData[spec as keyof FormData] || ""}
              onChange={handleChange}
            />
          </FormGroup>
        ))}

        <Button type="submit">Submit Listing</Button>
      </form>
    </SellingFormContainer>
  );
};

export { SellingComponent };
