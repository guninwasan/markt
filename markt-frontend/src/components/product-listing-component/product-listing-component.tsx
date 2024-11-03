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
import { ProductSpecs } from "./product-specifications";

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
          <ProductSpecs specs={dummySpecifications} />
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
