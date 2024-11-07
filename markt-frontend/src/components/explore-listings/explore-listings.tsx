import React, { useState } from "react";
import {
  Container,
  Header,
  SubheaderContainer,
  Subheader,
  ListingsContainer,
} from "./explore-listings.styles";
import { ListingContainer } from "../listing-container";
import { dummyData1, dummyData2, dummyData3 } from "../dummy-listing-data";

type SectionType = "featured" | "new" | "priceDrops";

const ExploreListings = () => {
  const [selectedSection, setSelectedSection] =
    useState<SectionType>("featured");

  const listings = {
    featured: dummyData1,
    new: dummyData2,
    priceDrops: dummyData3,
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
