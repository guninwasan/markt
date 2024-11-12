import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  SubheaderContainer,
  Subheader,
  ListingsContainer,
} from "./explore-listings.styles";
import { ListingContainer } from "../listing-container";
import { dummyData1, dummyData2 } from "../dummy-listing-data";
import { API_BASE_URL } from "../api";

type SectionType = "featured" | "hot";

const ExploreListings = () => {
  const [selectedSection, setSelectedSection] =
    useState<SectionType>("featured");

  const [exploreListings, setExploreListings] = useState<any>([]);
  const [cheapestListings, setCheapestListings] = useState<any>([]);

  const listings = {
    featured: exploreListings || dummyData1,
    hot: cheapestListings || dummyData2,
  };

  useEffect(() => {
    const fetchData = async (cheapest?: boolean) => {
      const cheapestURL = `${API_BASE_URL}/api/listing/search?query=e&filter=top_price_low&page=1&page_size=5&deepSearch=true`;
      const exploreURL = `${API_BASE_URL}/api/listing/search?query=e&filter=top_rated&page=1&page_size=5&deepSearch=true`;
      const response = await fetch(cheapest ? cheapestURL : exploreURL);

      try {
        if (response.ok) {
          const data = await response.json();
          if (cheapest) {
            setCheapestListings(data?.data ?? dummyData2);
          } else {
            setExploreListings(data?.data ?? dummyData1);
          }
        } else {
          console.error("Error fetching listings");
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchData();
    fetchData(true);
  }, []);

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
          isSelected={selectedSection === "hot"}
          onClick={() => setSelectedSection("hot")}
        >
          Hot
        </Subheader>
      </SubheaderContainer>

      <ListingsContainer>
        {listings[selectedSection].map((listing: any) => (
          <ListingContainer
            key={listing.id}
            id={listing.id}
            image={listing.display_image}
            title={listing.title}
            price={listing.price}
            condition={listing?.flairs?.negotiable}
            location={listing.pickup_location}
          />
        ))}
      </ListingsContainer>
    </Container>
  );
};

export { ExploreListings };
