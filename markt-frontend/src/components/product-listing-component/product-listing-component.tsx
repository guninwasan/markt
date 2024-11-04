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
  BottomTab,
  ShareInterestButton,
  ModalContent,
  ModalBackdrop,
  NoteTextArea,
} from "./product-listing-component.styles";

const ProductListingComponent = () => {
  const { isMobile } = useIsMobile();
  const [isBottomTabVisible, setBottomTabVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [note, setNote] = useState("");

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

  const handleCloseModal = () => {
    setIsModalVisible(false); 
  };

  const handleSendEmail = () => {
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
  
    const mailtoLink = `mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
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
      
              <ShareInterestButton onClick={handleShareInterestClick}>
                Share Interest
              </ShareInterestButton>

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
            <ul>
              <li>Specification 1</li>
              <li>Specification 2</li>
              <li>Specification 3</li>
              <li>Specification 4</li>
            </ul>
          </ProductSpecsContainer>
        </ProductDetails>
      </ProductListingContainer>

      {isModalVisible && (
        <ModalBackdrop>
          <ModalContent>
            <p>Before sharing your interest in the product with the seller, do you have any questions for the seller?</p>

            <NoteTextArea
              placeholder="Enter your concerns here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div>
              <button onClick={handleSendEmail}>
                Share Interest
              </button>
              <button onClick={handleCloseModal} style={{ marginLeft: "10px" }}>Close</button>
            </div>            
          </ModalContent>
        </ModalBackdrop>
      )}

      {isMobile && (
        <BottomTab isVisible={isBottomTabVisible} test-id="bottom-tab">
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
