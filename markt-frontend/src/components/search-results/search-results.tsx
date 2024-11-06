import { useSearchParams } from "react-router-dom";
import { ListingContainer } from "../listing-container";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { dummyData1, dummyData2, dummyData4 } from "../dummy-listing-data";
import { colors } from "../../utils";

const SearchResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem;
`;

const NoResultsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  flex-direction: column;
`;

const NoResultsHeading = styled.h1`
  font-size: 2rem;
  color: ${colors.textBlack};
`;

const NoResultsText = styled.p`
  font-size: 1rem;
  color: ${colors.textBlack};
`;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");

  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    console.log("searching for: ", keywords);
    setSearchResults([...dummyData4]);
  }, [keywords]);

  return (
    <>
      {searchResults.length === 0 && (
        <NoResultsContainer>
          <NoResultsHeading>No Results Found</NoResultsHeading>
          <NoResultsText>
            There were no results found for your search. Try searching for
            something else or check back later.
            <br />
            <br />
            Meanwhile, feel free to browse through our featured listings below.
          </NoResultsText>
        </NoResultsContainer>
      )}
      <SearchResultsContainer>
        {searchResults.map((result: any) => (
          <ListingContainer
            key={result.id}
            id={result.id}
            title={result.title}
            price={result.price}
            image={result.image}
            condition="new"
            location="location"
          />
        ))}
      </SearchResultsContainer>
    </>
  );
};

export { SearchResults };
