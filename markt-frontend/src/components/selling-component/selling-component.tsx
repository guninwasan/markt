import { useState } from "react";
import axios from "axios";
import { SellingFormContainer, Button } from "./selling-component.styles";
import {
  EssentialDetails,
  MediaSection,
  ProductFlairs,
  Specifications,
  AdditionalDetails,
} from "./sections";
import { uploadImage } from "../upload-image";

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
  const [displayImage, setDisplayImage] = useState<File | null>(
    formData.media[0] || null
  );
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }
    if (priceError) {
      alert("Please correct the errors in the form.");
      return;
    }

    try {
      const displayMediaUrl = await uploadImage(displayImage as File);
      console.log("Display media URL:", displayMediaUrl);

      const getMediaURLs = await Promise.all(
        mediaFiles.map(async (file: File) => {
          return await uploadImage(file);
        })
      );

      console.log("Media URLs:", getMediaURLs);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <SellingFormContainer>
      <h1>List Your Product</h1>
      <form onSubmit={handleSubmit}>
        <EssentialDetails
          formData={formData}
          handleChange={handleChange}
          handlePriceChange={handlePriceChange}
          priceError={priceError}
        />
        <MediaSection
          setMediaFiles={setMediaFiles}
          mediaFiles={mediaFiles}
          displayImage={displayImage}
          setDisplayImage={setDisplayImage}
        />

        <ProductFlairs
          formData={formData}
          handleTagSelection={handleTagSelection}
        />
        <Specifications formData={formData} handleChange={handleChange} />
        <AdditionalDetails formData={formData} handleChange={handleChange} />
        <Button type="submit">Post Listing</Button>
      </form>
    </SellingFormContainer>
  );
};

export { SellingComponent };
