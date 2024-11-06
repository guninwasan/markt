import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
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
} from "./listing-container.styles";
import { useState } from "react";

type ListingContainerProps = {
  id: string;
  image: string;
  title: string;
  price: string;
  condition: string;
  location: string;
};

const ListingContainer = ({
  id,
  image,
  title,
  price,
  condition,
  location,
}: ListingContainerProps) => {
  const [isWishList, setIsWishList] = useState(false);
  const navigate = useNavigate();

  const handleWishlistClick = (e: any) => {
    setIsWishList(!isWishList);
    e.stopPropagation();
  };

  const handleClick = () => {
    navigate(`/listing?id=${id}`);
  };

  return (
    <Container onClick={handleClick}>
      <Image src={image} alt={title} />
      <InfoContainer>
        <Title>{title}</Title>
        <Price>{price}</Price>
      </InfoContainer>
      <AdditionalInfo>
        <WishlistIcon isWishList={isWishList} onClick={handleWishlistClick}>
          <FaHeart />
        </WishlistIcon>
        <TextInfo>
          <Location>{location}</Location>
          <Condition>{condition}</Condition>
        </TextInfo>
      </AdditionalInfo>
    </Container>
  );
};

export { ListingContainer };
