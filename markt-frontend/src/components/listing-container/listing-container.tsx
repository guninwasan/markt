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
  const navigate = useNavigate();

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
        <WishlistIcon>
          <FaHeart />
        </WishlistIcon>
        <TextInfo>
          <Condition>{condition}</Condition>
          <Location>{location}</Location>
        </TextInfo>
      </AdditionalInfo>
    </Container>
  );
};

export { ListingContainer };
