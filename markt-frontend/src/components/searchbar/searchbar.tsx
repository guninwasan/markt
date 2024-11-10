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

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Make API request if search term is not empty
    if (newSearchTerm.trim()) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/listing/search?query=${newSearchTerm}&filter=price_low&page=1&page_size=5&deepSearch=false`
        );
        const data = await response.json();

        if (data.status === 1000 && data.data) {
          setSuggestions(data.data.map((item: any) => item.title));
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
            <DropdownItem key={index} onClick={() => setSearchTerm(suggestion)}>
              {highlightMatch(suggestion)}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </SearchBarContainer>
  );
};

export { SearchBar };
