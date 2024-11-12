import {
  ProductSpecsContainer,
  SpecGrid,
  SpecCategory,
  SpecItem,
} from "./product-listing-component.styles";

const ProductSpecs = ({ specs }: any) => {
  const {
    additional_details,
    battery_life,
    brand,
    color,
    dimensions,
    material,
    model,
    quantity,
    storage_capacity,
    weight,
  } = specs ?? {};
  return (
    <ProductSpecsContainer>
      <h2>Product Specifications</h2>
      <SpecGrid>
        <SpecCategory>
          <h3>Basic Information</h3>
          <SpecItem>Quantity: {quantity}</SpecItem>
          <SpecItem>Brand: {brand}</SpecItem>
          <SpecItem>Model: {model}</SpecItem>
        </SpecCategory>
        <SpecCategory>
          <h3>Appearance</h3>
          <SpecItem>Color: {color}</SpecItem>
          <SpecItem>Dimensions: {dimensions}</SpecItem>
          <SpecItem>Weight: {weight}</SpecItem>
          <SpecItem>Material: {material}</SpecItem>
        </SpecCategory>
        <SpecCategory>
          <h3>Performance</h3>
          <SpecItem>Battery Life: {battery_life}</SpecItem>
          <SpecItem>Storage Capacity: {storage_capacity}</SpecItem>
        </SpecCategory>
        <SpecCategory>
          <h3>Additional Details</h3>
          <SpecItem>{additional_details}</SpecItem>
        </SpecCategory>
      </SpecGrid>
    </ProductSpecsContainer>
  );
};

export { ProductSpecs };
