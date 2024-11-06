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
  BottomTab,
  ShareInterestButton,
  ModalContent,
  ModalBackdrop,
  NoteTextArea,
  BottomTabRow,
} from "./product-listing-component.styles";
import { ProductSpecs } from "./product-specifications";
// import { useSearchParams } from "react-router-dom";

const ProductListingComponent = () => {
  // const [searchParams] = useSearchParams();
  // const id = searchParams.get("id");
  const { isMobile } = useIsMobile();
  const [isBottomTabVisible, setBottomTabVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [note, setNote] = useState("");

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

  const handleShareInterestClick = () => {
    setIsModalVisible(true);
  };

  const ShareInterestButtonContainer = () => {
    return (
      <ShareInterestButton onClick={handleShareInterestClick}>
        Share Interest
      </ShareInterestButton>
    );
  };

  const SellerInfoContainer = () => {
    return (
      <div>
        <div>SELLER ID # 1234</div>
        Add stars here
      </div>
    );
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSendEmail = () => {
    /* NOTE FOR DEVELOPER: PLEASE UPDATE VARIABLES 
    IN THIS AS WELL WHEN API CALLS MADE */

    const sellerName = "Seller Name";
    const productTitle = "Product Title";
    const productId = "Product ID";
    const productPrice = "Product Price";
    const buyerName = "Buyer Name";
    const sellerEmail = "hello123@example.com";
    const buyerNote = note;

    const subject = `Interest in your product listing on Markt: ${productTitle}`;

    const body = `
  Hello ${sellerName},
  
  I am interested in a product listed by you on Markt!
  
  Product details:
  Product title: ${productTitle}
  Product ID: ${productId}
  Listed price: ${productPrice}

  Note from buyer:
  ${buyerNote}
  
  For the seller:

  Please reply to the buyer on this email. 
  
  Please remove the listing if the product is no longer available.
  
  Regards,
  Team Markt
    `;

    const mailtoLink = `mailto:${sellerEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

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

              <ShareInterestButtonContainer />
            </TitleAndDescription>

            <PriceBox>
              <PriceText>CAD $$$</PriceText>
              <div>Negotiable / Non-negotiable</div>
              <SellerInfo>
                <SellerAvatar
                  src="https://via.placeholder.com/50"
                  alt="Seller Avatar"
                />
                <SellerInfoContainer />
              </SellerInfo>
            </PriceBox>
          </TitleAndPriceContainer>
          <ProductSpecs specs={dummySpecifications} />
        </ProductDetails>
      </ProductListingContainer>

      {isModalVisible && (
        <ModalBackdrop>
          <ModalContent>
            <p>
              Before sharing your interest in the product with the seller, do
              you have any questions for the seller?
            </p>

            <NoteTextArea
              placeholder="Enter your concerns here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div>
              <button onClick={handleSendEmail}>Share Interest</button>
              <button onClick={handleCloseModal} style={{ marginLeft: "10px" }}>
                Close
              </button>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}

      {isMobile && (
        <BottomTab isVisible={isBottomTabVisible} test-id="bottom-tab">
          <BottomTabRow>
            <SellerInfoContainer />
            <PriceText>CAD $$$</PriceText>
          </BottomTabRow>
          <ShareInterestButtonContainer />
        </BottomTab>
      )}
    </>
  );
};

export { ProductListingComponent };
