import styled from "styled-components";

type ProductListingComponentProps = {
  isMobile: boolean | null;
};

const ProductListingContainer = styled.div<ProductListingComponentProps>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  gap: 2rem;
  padding: 2rem;
`;

const ProductImages = styled.div`
  flex: 1;
`;

const ProductDetails = styled.div<ProductListingComponentProps>`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleAndPriceContainer = styled.div<ProductListingComponentProps>`
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

const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const SpecCategory = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 10px;
    font-size: 1.1em;
    color: #333;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
  }
`;

const SpecItem = styled.p`
  margin: 5px 0;
  font-size: 0.95em;
  color: #555;
`;

export {
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
  SpecGrid,
  SpecCategory,
  SpecItem,
};
