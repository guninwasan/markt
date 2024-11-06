import styled from "styled-components";

const Container = styled.div`
  width: 200px; /* Adjustable for square-ish shape */
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Price = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #ff5722;
  margin-left: 8px;
`;

const AdditionalInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  justify-content: space-between;
`;

const WishlistIcon = styled.div`
  color: #ff4081;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s;

  &:hover {
    color: #d81b60;
  }
`;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  color: #757575;
  margin-left: 8px;
`;

const Condition = styled.span`
  font-size: 12px;
  color: #757575;
`;

const Location = styled.span`
  font-size: 12px;
  color: #757575;
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
