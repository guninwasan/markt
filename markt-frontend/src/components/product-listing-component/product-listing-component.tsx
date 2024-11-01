import { useIsMobile } from "../../hooks";
import { ImageGallery } from "../image-gallery";
import { useEffect, useState } from "react";
import {
  ProductListingContainer,
  ProductImages,
  ProductDetails,
  TitleAndPriceContainer,
  TitleAndDescription,
  PriceBox,
  PriceText,
  SellerInfo,
  SellerAvatar,
  ProductSpecsContainer,
  SpecGrid,
  SpecCategory,
  SpecItem,
  BottomTab,
} from "./product-listing-component.styles";

const ProductListingComponent = () => {
  const { isMobile } = useIsMobile();
  const [isBottomTabVisible, setBottomTabVisible] = useState(false);

  const dummySpecifications = {
    basicInfo: {
      condition: "Good",
      brand: "Brand Name",
      model: "Model X",
      yearOfManufacture: "2022",
    },
    appearance: {
      color: "Black",
      dimensions: "100 x 100 x 100 cm",
      weight: "500g",
      material: "Aluminum",
    },
    performance: {
      batteryLife: "10 hours",
      storageCapacity: "256GB",
      additionalFeatures: "Water-resistant, Bluetooth-enabled",
    },
    warranty: "No warranty",
  };

  useEffect(() => {
    const handleScroll = () => {
      setBottomTabVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <ProductListingContainer isMobile={isMobile}>
        <ProductImages>
          <ImageGallery
            mediaUrls={[
              "https://images-na.ssl-images-amazon.com/images/I/71g2ednj0JL._AC_SL1500_.jpg",
              "https://images-na.ssl-images-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg",
              "https://images-na.ssl-images-amazon.com/images/I/71K7Q4FpguL._AC_SL1500_.jpg",
              "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            ]}
          />
        </ProductImages>
        <ProductDetails isMobile={isMobile}>
          <TitleAndPriceContainer isMobile={isMobile}>
            <TitleAndDescription>
              <h1>Product Title</h1>
              <p>
                Description description description description description
                description description description description description
                description description description description description
                description description description
              </p>
            </TitleAndDescription>
            <PriceBox>
              <PriceText>CAD $$$</PriceText>
              <div>Negotiable / Non-negotiable</div>
              <SellerInfo>
                <SellerAvatar
                  src="https://via.placeholder.com/50"
                  alt="Seller Avatar"
                />
                <div>
                  <div>NAME BLURRED</div>
                  <div>SELLER ID # 1234</div>
                  <a href="#">See all seller reviews</a>
                </div>
              </SellerInfo>
            </PriceBox>
          </TitleAndPriceContainer>

          <ProductSpecsContainer>
            <h2>Product Specifications</h2>
            <SpecGrid>
              <SpecCategory>
                <h3>Basic Information</h3>
                <SpecItem>
                  Condition: {dummySpecifications.basicInfo.condition}
                </SpecItem>
                <SpecItem>
                  Brand: {dummySpecifications.basicInfo.brand}
                </SpecItem>
                <SpecItem>
                  Model: {dummySpecifications.basicInfo.model}
                </SpecItem>
                <SpecItem>
                  Year: {dummySpecifications.basicInfo.yearOfManufacture}
                </SpecItem>
              </SpecCategory>
              <SpecCategory>
                <h3>Appearance</h3>
                <SpecItem>
                  Color: {dummySpecifications.appearance.color}
                </SpecItem>
                <SpecItem>
                  Dimensions: {dummySpecifications.appearance.dimensions}
                </SpecItem>
                <SpecItem>
                  Weight: {dummySpecifications.appearance.weight}
                </SpecItem>
                <SpecItem>
                  Material: {dummySpecifications.appearance.material}
                </SpecItem>
              </SpecCategory>
              <SpecCategory>
                <h3>Performance</h3>
                <SpecItem>
                  Battery Life: {dummySpecifications.performance.batteryLife}
                </SpecItem>
                <SpecItem>
                  Storage Capacity:{" "}
                  {dummySpecifications.performance.storageCapacity}
                </SpecItem>
                <SpecItem>
                  Features: {dummySpecifications.performance.additionalFeatures}
                </SpecItem>
              </SpecCategory>
              <SpecCategory>
                <h3>Warranty</h3>
                <SpecItem>{dummySpecifications.warranty}</SpecItem>
              </SpecCategory>
            </SpecGrid>
          </ProductSpecsContainer>
        </ProductDetails>
      </ProductListingContainer>

      {isMobile && (
        <BottomTab isVisible={isBottomTabVisible} test-id="bottom-tab">
          <PriceText>CAD $$$</PriceText>
          <SellerInfo>
            <SellerAvatar
              src="https://via.placeholder.com/50"
              alt="Seller Avatar"
            />
            <div>
              <div>NAME BLURRED</div>
              <div>SELLER ID # 1234</div>
              <a href="#">See all seller reviews</a>
            </div>
          </SellerInfo>
        </BottomTab>
      )}
    </>
  );
};

export { ProductListingComponent };
