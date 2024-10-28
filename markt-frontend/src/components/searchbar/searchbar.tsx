import React, { useState } from 'react';
import { SearchBarContainer, SearchInput, SearchButton, InnerSearchBarContainer } from './searchbar.styles';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      console.log('Search submitted: ', searchTerm);
      // You can replace this with your actual search logic
    }
  };

  return (
    <SearchBarContainer>
      <InnerSearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Search for an item or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()} // Optional: Submit with Enter key
        />
        <SearchButton onClick={handleSearchSubmit} aria-label="Submit search">  
          <FaSearch />
        </SearchButton>
      </InnerSearchBarContainer>
    </SearchBarContainer>
  );
};

export { SearchBar };