import {
  ProductSpecsContainer,
  SpecGrid,
  SpecCategory,
  SpecItem,
} from "./product-listing-component.styles";

const ProductSpecs = ({ specs }: any) => {
  return (
    <ProductSpecsContainer>
      <h2>Product Specifications</h2>
      <SpecGrid>
        <SpecCategory>
          <h3>Basic Information</h3>
          <SpecItem>Condition: {specs.basicInfo.condition}</SpecItem>
          <SpecItem>Brand: {specs.basicInfo.brand}</SpecItem>
          <SpecItem>Model: {specs.basicInfo.model}</SpecItem>
          <SpecItem>Year: {specs.basicInfo.yearOfManufacture}</SpecItem>
        </SpecCategory>
        <SpecCategory>
          <h3>Appearance</h3>
          <SpecItem>Color: {specs.appearance.color}</SpecItem>
          <SpecItem>Dimensions: {specs.appearance.dimensions}</SpecItem>
          <SpecItem>Weight: {specs.appearance.weight}</SpecItem>
          <SpecItem>Material: {specs.appearance.material}</SpecItem>
        </SpecCategory>
        <SpecCategory>
          <h3>Performance</h3>
          <SpecItem>Battery Life: {specs.performance.batteryLife}</SpecItem>
          <SpecItem>
            Storage Capacity: {specs.performance.storageCapacity}
          </SpecItem>
          <SpecItem>Features: {specs.performance.additionalFeatures}</SpecItem>
        </SpecCategory>
        <SpecCategory>
          <h3>Warranty</h3>
          <SpecItem>{specs.warranty}</SpecItem>
        </SpecCategory>
      </SpecGrid>
    </ProductSpecsContainer>
  );
};

export { ProductSpecs };
