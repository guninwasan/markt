import React, { useState, useEffect } from "react";
import {
  SearchBarContainer,
  SearchInput,
  SearchButton,
  InnerSearchBarContainer,
  SuggestionsDropdown,
  SuggestionItem,
  SeeAllResultsItem
} from "./searchbar.styles";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  interface Suggestion {
    title: string;
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Fetch suggestions based on the search term
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) return; // No suggestions if input is empty

    try {
      const response = await fetch(`http://localhost:5000/api/listing/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data.slice(0, 3)); // Show only the top 3 results
        setDropdownVisible(true);
      } else {
        console.error("Error fetching suggestions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Debounce input change
  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimeout = setTimeout(() => fetchSuggestions(searchTerm), 300);
      return () => clearTimeout(debounceTimeout); // Clear timeout if input changes again
    } else {
      setSuggestions([]);
      setDropdownVisible(false);
    }
  }, [searchTerm]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      console.log("Search submitted:", searchTerm);
      setDropdownVisible(false);
      // Implement your search submission logic here
    }
  };

  return (
    <SearchBarContainer>
      <InnerSearchBarContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          placeholder="Search for an item or category..."
        />
        <SearchButton onClick={handleSearchSubmit}>
          <FaSearch />
        </SearchButton>

        {/* Dropdown for suggestions */}
        {isDropdownVisible && suggestions.length > 0 && (
          <SuggestionsDropdown>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem key={index} onClick={() => setSearchTerm(suggestion.title)}>
                {suggestion.title}
              </SuggestionItem>
            ))}
            <SeeAllResultsItem onClick={handleSearchSubmit}>
              See all results for "{searchTerm}"
            </SeeAllResultsItem>
          </SuggestionsDropdown>
        )}
      </InnerSearchBarContainer>
    </SearchBarContainer>
  );
};

export { SearchBar };
