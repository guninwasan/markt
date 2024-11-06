import styled from "styled-components";
import { colors } from "../../utils";

const Container = styled.div`
  width: 200px;
  padding: 1rem;
  border: 1px solid ${colors.lightGrey};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
  justify-content: space-between;
  overflow: hidden;
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

const Price = styled.span`
  font-size: 14px;
  font-weight: 1000;
  color: ${colors.darkerHoverPrimary};
  margin-left: 8px;
  overflow: hidden;
`;

const AdditionalInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  justify-content: space-between;
`;

const WishlistIcon = styled.div<{ isWishList?: boolean }>`
  color: ${({ isWishList }) => (isWishList ? colors.red : colors.grey)};
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s;

  &:hover {
    color: ${({ isWishList }) =>
      isWishList ? colors.darkGrey : colors.redHover};
  }
`;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  color: ${colors.textBlack};
  margin-left: 8px;
`;

const Condition = styled.span`
  font-size: 12px;
  color: ${colors.darkGrey};
`;

const Location = styled.span`
  font-size: 12px;
  color: ${colors.darkGrey};
  font-weight: bold;
`;

export {
  Container,
  Image,
  InfoContainer,
  Title,
  Price,
  AdditionalInfo,
  WishlistIcon,
  TextInfo,
  Condition,
  Location,
};
