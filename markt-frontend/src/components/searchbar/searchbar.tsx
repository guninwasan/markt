import React, { useState } from "react";
import {
  SearchBarContainer,
  SearchInput,
  SearchButton,
  InnerSearchBarContainer,
  Dropdown,
  DropdownItem,
} from "./searchbar.styles";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Make API request if search term is not empty
    if (newSearchTerm.trim()) {
      try {
        const response = await fetch(
          `"https://project-1-web-application-design-group15.onrender.com/api/listing/search?query=${newSearchTerm}&filter=price_low&page=1&page_size=5&deepSearch=false`
        );
        const data = await response.json();

        if (data.status === 1000 && data.data) {
          setSuggestions(data.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      console.log("Search submitted: ", searchTerm);
    }
  };

  // Function to highlight only the first match in the suggestion
  const highlightMatch = (suggestion: string) => {
    if (!searchTerm) return suggestion;
    
    const regex = new RegExp(`(${searchTerm})`, "i"); // Case-insensitive matching for the first occurrence
    const parts = suggestion.split(regex);

    let isFirstMatch = true;

    return parts.map((part, index) => {
      if (isFirstMatch && part.toLowerCase() === searchTerm.toLowerCase()) {
        isFirstMatch = false;
        return (
          <strong key={index} style={{ fontWeight: "bold" }}>
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const handleDropdownClick = (listingId: number) => {
    // Navigate to the listing page
    navigate(`/listing?id=${listingId}`);
  };

  return (
    <SearchBarContainer style={{ position: "relative" }}>
      <InnerSearchBarContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <SearchButton onClick={handleSearchSubmit}>
          <FaSearch />
        </SearchButton>
      </InnerSearchBarContainer>

      {/* Styled dropdown for suggestions */}
      {suggestions.length > 0 && (
        <Dropdown>
          {suggestions.map((suggestion, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleDropdownClick(suggestion.id)} // Use listing id to navigate
            >
              {highlightMatch(suggestion.title)} {}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </SearchBarContainer>
  );
};

export { SearchBar };
