import { useSearchParams } from "react-router-dom";
import { ListingContainer } from "../listing-container";
import { API_BASE_URL } from "../api"
import { useEffect, useState } from "react";
import {
  NoResultsContainer,
  NoResultsHeading,
  NoResultsText,
  SearchResultsContainer,
  ResultsContainer,
  PaginationContainer,
  PaginationButton,
  SortByContainer,
  SortBySelect,
  SortByOption,
} from "./search-results.styles";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");

  const [searchResults, setSearchResults] = useState<any>([]); // State for storing search results
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading state
  const [currentPage, setCurrentPage] = useState<number>(1); // State for the current page of results
  const [totalPages, setTotalPages] = useState<number>(1); // Total number of pages for pagination
  const [sortOption, setSortOption] = useState<string>("price_low"); // State for the selected sort option

  useEffect(() => {
    if (keywords) {
      setLoading(true); // Set loading to true when starting the search
      setSearchResults([]); // Reset search results to empty array before starting a new fetch
      // Fetch results from the API
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/listing/search?query=${keywords}&filter=${sortOption}&page=${currentPage}&page_size=9&deepSearch=true`
          );
          const data = await response.json();

          if (data.status === 1000 && data.data) {
            setSearchResults(data.data); // Set search results from API
            setTotalPages(data.total_pages); // Set the total pages for pagination
          } else {
            setSearchResults([]); // No results found
            setTotalPages(1); // No pages if no results
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]); // In case of an error, set empty results
        } finally {
          setLoading(false); // Set loading to false once the data is fetched
        }
      };

      fetchSearchResults();
    }
  }, [keywords, currentPage, sortOption]); // Re-fetch results when keywords, currentPage, or sortOption change

  useEffect(() => {
    // Scroll to the top when currentPage changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Update the current page on pagination button click
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value); // Update sort option based on dropdown selection
  };

  return (
    <>
      {/* Show loading screen only when data is being fetched */}
      {loading ? (
        <NoResultsContainer>
          <NoResultsHeading>Loading...</NoResultsHeading>
          <NoResultsText>We are fetching the search results for you.</NoResultsText>
        </NoResultsContainer>
      ) : searchResults.length === 0 ? (
        // Show no results message if no listings are found
        <NoResultsContainer>
          <NoResultsHeading>No Results Found</NoResultsHeading>
          <NoResultsText>
            We couldn't find any listings for the search term "<strong>{keywords}</strong>". 
            Please try refining your search or check back later for more listings.
            <br />
            <br />
            In the meantime, feel free to browse through our featured listings below.
          </NoResultsText>
        </NoResultsContainer>
      ) : (
        // Show the search results if data is available
        <ResultsContainer>Your search results for: <strong>{keywords}</strong></ResultsContainer>
      )}

      {/* Only render SortBy dropdown if not loading */}
      {!loading && (
        <SortByContainer>
          <span>Sort By: </span>
          <SortBySelect value={sortOption} onChange={handleSortChange}>
            <SortByOption value="price_low">Lowest Price</SortByOption>
            <SortByOption value="price_high">Highest Price</SortByOption>
            <SortByOption value="top_rated">Most Popular</SortByOption>
          </SortBySelect>
        </SortByContainer>
      )}

      {/* Render the listings if search results are available */}
      <SearchResultsContainer>
        {searchResults.map((result: any) => (
          <ListingContainer
            key={result.id}
            id={result.id}
            title={result.title}
            price={result.price}
            image={result.display_image}
            condition={result.condition}
            location={result.pickup_location}
          />
        ))}
      </SearchResultsContainer>

      {/* Conditionally render pagination controls */}
      {searchResults.length > 0 && (
        <PaginationContainer>
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </PaginationButton>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <PaginationButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </>
  );
};

export { SearchResults };
