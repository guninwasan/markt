import { validateFormData } from "./valid-form-details";

describe("validateFormData", () => {
  const validFormData = {
    title: "Sample Product",
    price: "100",
    description: "This is a sample product.",
    negotiable: false,
    condition: "New",
    flairs: ["Sale"],
    media: [],
    brand: "SampleBrand",
    model: "SampleModel",
    yearOfManufacture: "2023",
    color: "Red",
    dimensions: "10x10x10",
    weight: "1kg",
    material: "Plastic",
    batteryLife: "10 hours",
    storageCapacity: "128GB",
    additionalFeatures: "Waterproof",
    additionalDetails: "None",
    pickupLocation: "SampleLocation",
  };

  it("should return no errors for valid form data", () => {
    const errors = validateFormData(validFormData, new File([], "image.jpg"));
    expect(errors).toHaveLength(0);
  });

  it("should return an error if title is missing", () => {
    const formData = { ...validFormData, title: "" };
    const errors = validateFormData(formData, new File([], "image.jpg"));
    expect(errors).toContain("Title is required.");
  });

  it("should return an error if price is missing", () => {
    const formData = { ...validFormData, price: "" };
    const errors = validateFormData(formData, new File([], "image.jpg"));
    expect(errors).toContain("Price is required.");
  });

  it("should return an error if description is missing", () => {
    const formData = { ...validFormData, description: "" };
    const errors = validateFormData(formData, new File([], "image.jpg"));
    expect(errors).toContain("Description is required.");
  });

  it("should return an error if price is not a valid positive number", () => {
    const formData = { ...validFormData, price: "-100" };
    const errors = validateFormData(formData, new File([], "image.jpg"));
    expect(errors).toContain("Please enter a valid positive number for price.");
  });

  it("should return an error if display image is missing", () => {
    const errors = validateFormData(validFormData, null);
    expect(errors).toContain("Display Image is required.");
  });
});
