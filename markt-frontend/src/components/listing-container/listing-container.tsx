import { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState, selectors, setWishList } from "../../redux";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();

  const { wishList } = useSelector((state: RootState) => ({
    wishList: selectors.getWishList(state),
  }));

  useEffect(() => {
    if (wishList?.includes(parseInt(id))) {
      setIsWishList(true);
    }
  }, [wishList, id]);

  const handleWishlistClick = (e: any) => {
    e.stopPropagation();

    const currentWishList = Array.isArray(wishList) ? wishList : [];

    if (isWishList) {
      dispatch(
        setWishList(currentWishList.filter((item) => item !== parseInt(id)))
      );
    } else {
      dispatch(setWishList([...currentWishList, parseInt(id)]));
    }
    setIsWishList(!isWishList);
  };

  const handleClick = () => {
    navigate(`/listing?id=${id}`);
  };

  return (
    <Container onClick={handleClick} data-testID="listingContainer">
      <Image src={image} alt={title} />
      <InfoContainer>
        <Title>{title}</Title>
        <Price>{price}</Price>
      </InfoContainer>
      <AdditionalInfo>
        <WishlistIcon
          isWishList={isWishList}
          onClick={handleWishlistClick}
          data-testID="wishlist-button"
          className={isWishList ? "wishlist-icon-active" : ""}
        >
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
