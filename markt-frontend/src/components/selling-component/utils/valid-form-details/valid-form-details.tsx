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
  additionalDetails: string;
};

const validateFormData = (
  formData: FormData,
  displayImage: File | null
): string[] => {
  const errors: string[] = [];

  if (!formData.title) errors.push("Title is required.");
  if (!formData.price) errors.push("Price is required.");
  if (!formData.description) errors.push("Description is required.");

  const priceAsNumber = parseFloat(formData.price);
  if (isNaN(priceAsNumber) || priceAsNumber < 0) {
    errors.push("Please enter a valid positive number for price.");
  }

  if (!displayImage) errors.push("Display Image is required.");

  return errors;
};

export { validateFormData };
