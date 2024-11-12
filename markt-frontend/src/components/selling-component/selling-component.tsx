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
import { useSelector } from "react-redux";
import { RootState, selectors, setIsLoading } from "../../redux";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";
import { AlertModal } from "../alert-modal";
import { useDispatch } from "react-redux";

const initialFormData = {
  title: "",
  price: "",
  description: "",
  negotiable: false,
  condition: "",
  flairs: [],
  pickupLocation: "",
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

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userEmail, apiKey, userID } = useSelector((state: RootState) => ({
    userEmail: selectors.getEmail(state),
    apiKey: selectors.getUserAuthJWT(state),
    userID: selectors.getUserID(state),
  }));

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
    const numericValue = value.replace(/[^0-9.]/g, "");
    const priceAsNumber = parseFloat(numericValue);

    if (value === "") {
      setPriceError("");
      setFormData((prevData: any) => ({ ...prevData, price: "" }));
    } else if (priceAsNumber > 10000) {
      setPriceError(
        "This exceeds the maximum transaction limit on our website (CAD 10,000)."
      );
    } else if (!isNaN(priceAsNumber) && priceAsNumber >= 0) {
      setPriceError("");
      setFormData((prevData: any) => ({ ...prevData, price: numericValue }));
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
      dispatch(setIsLoading(true));
      const displayMediaUrl = await uploadImage(displayImage as File);
      const getMediaURLs = await Promise.all(
        mediaFiles.map(async (file: File) => {
          return await uploadImage(file);
        })
      );
      dispatch(setIsLoading(false));
      const requestData = {
        owner_email: userEmail,
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        negotiable: formData.negotiable,
        condition: formData.condition,
        flairs: formData.flairs,
        pickup_location: formData.pickupLocation,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        dimensions: formData.dimensions,
        weight: formData.weight,
        material: formData.material,
        battery_life: formData.batteryLife,
        storage_capacity: formData.storageCapacity,
        additional_details: formData.additionalDetails,
        display_image: displayMediaUrl,
        media: getMediaURLs,
      };
      dispatch(setIsLoading(true));
      const response = await fetch(`${API_BASE_URL}/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": `${apiKey}`,
          "User-ID": `${userID}`,
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        dispatch(setIsLoading(false));
        setShowAlert(true);
        setAlertMessage("Listing created successfully!");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
        }, 3000);
      } else {
        dispatch(setIsLoading(false));
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(`Error creating listing: ${errorData.data}`);
        console.error("Error:", errorData);
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Error uploading listing:", error);
      setShowAlert(true);
      setAlertMessage("Error uploading listing. Please try again later.");
    }
  };

  return (
    <SellingFormContainer>
      <AlertModal
        isOpen={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
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
