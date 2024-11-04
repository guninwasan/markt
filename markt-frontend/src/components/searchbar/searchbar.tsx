import React, { useEffect, useState } from "react";
import {
  SearchBarContainer,
  SearchInput,
  SearchButton,
  InnerSearchBarContainer,
} from "./searchbar.styles";
import { FaSearch } from "react-icons/fa";
import { useIsMobile } from "../../hooks";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      console.log("Search submitted: ", searchTerm);
    }
  };

  return (
    <SearchBarContainer>
      <InnerSearchBarContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <SearchButton onClick={handleSearchSubmit}>
          <FaSearch />
        </SearchButton>
      </InnerSearchBarContainer>
    </SearchBarContainer>
  );
};

export { SearchBar };
