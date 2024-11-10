import { useSearchParams } from "react-router-dom";
import { ListingContainer } from "../listing-container";
import { useEffect, useState } from "react";
import { dummyData1, dummyData2 } from "../dummy-listing-data";
import {
  NoResultsContainer,
  NoResultsHeading,
  NoResultsText,
  SearchResultsContainer,
  ResultsContainer,
} from "./search-results.styles";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");

  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    console.log("searching for: ", keywords);
    // we need to add an API call here to fetch search results
    setSearchResults([...dummyData1, ...dummyData2]);
  }, [keywords]);

  return (
    <>
      {searchResults.length === 0 ? (
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
      ) : (
        <ResultsContainer>Your search results for: {keywords}</ResultsContainer>
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
