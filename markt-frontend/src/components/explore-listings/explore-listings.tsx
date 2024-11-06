import React, { useState } from "react";
import {
  Container,
  Header,
  SubheaderContainer,
  Subheader,
  ListingsContainer,
} from "./explore-listings.styles";
import { ListingContainer } from "../listing-container";

type SectionType = "featured" | "new" | "priceDrops";

const ExploreListings = () => {
  const [selectedSection, setSelectedSection] =
    useState<SectionType>("featured");

  const listings = {
    featured: [
      {
        id: "1",
        image: "/cover-image.jpg",
        title: "Sofa",
        price: "CAD 100.00",
        condition: "Brand New",
        location: "Toronto",
      },
      {
        id: "2",
        image: "/cover-image3.jpg",
        title: "Table",
        price: "CAD 100.00",
        condition: "Brand New",
        location: "Toronto",
      },
      {
        id: "3",
        image: "/cover-image.jpg",
        title: "Books",
        price: "CAD 1000.00",
        condition: "Brand New",
        location: "Toronto",
      },
    ],
    new: [
      {
        id: "4",
        image: "/cover-image.jpg",
        title: "Chair",
        price: "CAD 50.00",
        condition: "Used",
        location: "Vancouver",
      },
    ],
    priceDrops: [
      {
        id: "5",
        image: "/cover-image3.jpg",
        title: "Lamp",
        price: "CAD 20.00",
        condition: "Used",
        location: "Montreal",
      },
    ],
  };

  return (
    <Container>
      <Header>Explore Listings</Header>

      <SubheaderContainer>
        <Subheader
          isSelected={selectedSection === "featured"}
          onClick={() => setSelectedSection("featured")}
        >
          Featured Listings
        </Subheader>
        <Subheader
          isSelected={selectedSection === "new"}
          onClick={() => setSelectedSection("new")}
        >
          New to the Market
        </Subheader>
        <Subheader
          isSelected={selectedSection === "priceDrops"}
          onClick={() => setSelectedSection("priceDrops")}
        >
          Price Drops
        </Subheader>
      </SubheaderContainer>

      <ListingsContainer>
        {listings[selectedSection].map((listing) => (
          <ListingContainer
            key={listing.id}
            id={listing.id}
            image={listing.image}
            title={listing.title}
            price={listing.price}
            condition={listing.condition}
            location={listing.location}
          />
        ))}
      </ListingsContainer>
    </Container>
  );
};

export { ExploreListings };
