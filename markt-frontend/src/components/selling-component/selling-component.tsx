import { useState } from "react";
import { SellingFormContainer, Button } from "./selling-component.styles";
import {
  EssentialDetails,
  MediaSection,
  ProductFlairs,
  Specifications,
  AdditionalDetails,
} from "./sections";
import { uploadImage, validateFormData } from "./utils";

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

    const errors = validateFormData(formData, displayImage);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      // Mock display and media URLs
      const displayMediaUrl = "https://res.cloudinary.com/dywbiovuo/image/upload/v1731303570/rkyfsoggeclvefxzebrm.jpg";
      const mediaUrls = [
        "https://res.cloudinary.com/dywbiovuo/image/upload/v1731303570/qmbxpqfndolr6bqmlei8.jpg",
        "https://res.cloudinary.com/dywbiovuo/image/upload/v1731303570/dhvkdsjk1hl0qzrjg9zt.jpg"
      ];

      // Prepare the data to send to the backend, ensuring keys align with backend schema
      const requestData = {
        owner_email: "shikhar@utoronto.ca", // replace with dynamic email as needed
        title: formData.title,
        price: parseFloat(formData.price), // ensure price is a number
        description: formData.description,
        negotiable: formData.negotiable,
        condition: formData.condition,
        flairs: formData.flairs,
        media: formData.media,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        dimensions: formData.dimensions,
        weight: formData.weight,
        material: formData.material,
        battery_life: formData.batteryLife,
        storage_capacity: formData.storageCapacity,
        additional_features: formData.additionalFeatures,
        additional_details: formData.additionalDetails,
        display_image: displayMediaUrl,
        ...(formData.yearOfManufacture && { year_of_manufacture: parseInt(formData.yearOfManufacture) })
    };
          

      console.log("Request Data:", requestData); // Debugging: Log requestData

      // Make the POST request using fetch
      const response = await fetch("http://localhost:5000/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Listing created successfully!");
        console.log("Listing created:", result);
      } else {
        const errorData = await response.json();
        alert(`Error creating listing: ${errorData.data}`);
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error uploading listing:", error);
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
