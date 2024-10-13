import React, { useState } from "react";
import {
  Container,
  Header,
  SubheaderContainer,
  Subheader,
  ListingsContainer,
  Listing,
} from "./explore-listings.styles";

type SectionType = "featured" | "new" | "priceDrops";

type ListingsType = {
  [key: string]: string[];
};

const ExploreListings = () => {
  const [selectedSection, setSelectedSection] =
    useState<SectionType>("featured");

  const listings: ListingsType = {
    featured: [
      "Featured Listing 1",
      "Featured Listing 2",
      "Featured Listing 3",
      "Featured Listing 4",
    ],
    new: ["New Listing 1", "New Listing 2", "New Listing 3"],
    priceDrops: ["Price Drop 1", "Price Drop 2", "Price Drop 3"],
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
        {listings[selectedSection].map((listing, index) => (
          <Listing key={index}>{listing}</Listing>
        ))}
      </ListingsContainer>
    </Container>
  );
};

export { ExploreListings };
