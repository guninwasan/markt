import { useIsMobile } from "../../hooks";
import { ImageGallery } from "../image-gallery";
import { Rating } from "../rating";
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
  Button,
  PickUpLocationText,
  PickUpLocationHeader,
} from "./product-listing-component.styles";
import { ProductSpecs } from "./product-specifications";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../api";

const ProductListingComponent = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { isMobile } = useIsMobile();
  const [isBottomTabVisible, setBottomTabVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [note, setNote] = useState("");

  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/listing/get/${id}?minimal=false`
        );
        if (!response.ok) {
          navigate("/not-found");
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        navigate("/not-found");
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  });

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

  const { buyer, owner, sold } = data?.database ?? {};
  const { display_image, flairs, pickup_location, price, title } =
    data?.essential ?? {
      display_image: "",
      flairs: { negotiable: false },
      pickup_location: "St. George - Bahen",
      price: 0,
      title: "",
    };

  const { negotiable } = flairs ?? { negotiable: false };

  const { media_files } = data?.media ?? { media_files: [] };

  const { email, full_name, rating } = owner ?? {
    email: "",
    full_name: "",
    rating: 0,
  };

  const description = data?.specifications?.description ?? "";

  const SellerInfoContainer = () => {
    return (
      <div>
        <div>SELLER ID # 1234</div>
        <Rating rating={rating} />
      </div>
    );
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSendEmail = () => {
    const sellerName = full_name;
    const productTitle = title;
    const productId = id;
    const productPrice = price;
    const sellerEmail = email;
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
          <ImageGallery mediaUrls={[display_image, ...media_files]} />
        </ProductImages>
        <ProductDetails isMobile={isMobile}>
          <TitleAndPriceContainer isMobile={isMobile}>
            <TitleAndDescription>
              <h1>{title}</h1>
              <p>{description}</p>
              <p>
                <PickUpLocationHeader>Pickup Location:</PickUpLocationHeader>
                <PickUpLocationText>{pickup_location}</PickUpLocationText>
              </p>
              <ShareInterestButtonContainer />
            </TitleAndDescription>

            <PriceBox>
              <PriceText>CAD {price ?? 0}</PriceText>
              <div>{negotiable ? "Negotiable" : "Non-negotiable"}</div>
              <SellerInfo>
                <SellerAvatar
                  src="https://via.placeholder.com/50"
                  alt="Seller Avatar"
                />
                <SellerInfoContainer />
              </SellerInfo>
            </PriceBox>
          </TitleAndPriceContainer>
          <ProductSpecs specs={data?.specifications} />
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
            <Button onClick={handleSendEmail} primaryColor>
              Share Interest
            </Button>
            <Button onClick={handleCloseModal} style={{ marginLeft: "10px" }}>
              Close
            </Button>
          </ModalContent>
        </ModalBackdrop>
      )}

      {isMobile && (
        <BottomTab isVisible={isBottomTabVisible} test-id="bottom-tab">
          <BottomTabRow>
            <SellerInfoContainer />
            <PriceText>CAD {price}</PriceText>
          </BottomTabRow>
          <ShareInterestButtonContainer />
        </BottomTab>
      )}
    </>
  );
};

export { ProductListingComponent };
