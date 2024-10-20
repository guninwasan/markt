import { useIsMobile } from "../../hooks";
import { ImageGallery } from "../image-gallery";
import styled from "styled-components";
import { useEffect, useState } from "react";

const StyledDiv = styled.div<{ isMobile: boolean | null }>;

const ProductListingContainer = StyledDiv`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  gap: 2rem;
  padding: 2rem;
`;

const ProductImages = styled.div`
  flex: 1;
`;

const ProductDetails = StyledDiv`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleAndPriceContainer = StyledDiv`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  gap: 2rem;
`;

const TitleAndDescription = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PriceBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PriceText = styled.div`
  font-weight: bold;
  font-size: 2.5rem;
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SellerAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ProductSpecsContainer = styled.div`
  margin-top: 2rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const BottomTab = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  padding: 1rem;
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductListingComponent = () => {
  const { isMobile } = useIsMobile();
  const [isBottomTabVisible, setBottomTabVisible] = useState(false);

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
            images={[
              "https://via.placeholder.com/150",
              "https://via.placeholder.com/150",
              "https://via.placeholder.com/150",
              "https://via.placeholder.com/150",
              "https://via.placeholder.com/150",
              "https://via.placeholder.com/150",
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
            <ul>
              <li>Specification 1</li>
              <li>Specification 2</li>
              <li>Specification 3</li>
              <li>Specification 4</li>
            </ul>
          </ProductSpecsContainer>
        </ProductDetails>
      </ProductListingContainer>
      {isMobile && (
        <BottomTab isVisible={isBottomTabVisible}>
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
