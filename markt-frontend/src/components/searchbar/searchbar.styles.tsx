import styled from "styled-components";

export const SearchBarContainer = styled.div`
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative; /* Needed for the dropdown positioning */
`;

export const InnerSearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1024px;
  border-radius: 8px; /* Rounded corners */
`;

export const SearchInput = styled.input`
  height: 2rem;
  border: none;
  padding-left: 1rem;
  font-size: 1.25rem;
  font-weight: 300;
  color: #333;
  outline: none;
  width: 100%; /* Adjust to make full width within the container */
  border-radius: 8px 8px 8px 8px; 
  &::placeholder {
    color: #999;
  }
`;

export const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding-left: 1rem;
  display: flex;
  align-items: center;
  border-radius: 0 8px 8px 0;
  &:hover {
    color: #333;
  }
  &:focus {
    outline: none;
  }
`;

export const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 2.5rem; /* Position below the input */
  width: 100%;
  max-width: 1024px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-top: none;
  z-index: 10;
  border-radius: 0 0 8px 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
`;

export const SuggestionItem = styled.div`
  padding: 10px;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const SeeAllResultsItem = styled(SuggestionItem)`
  font-weight: bold;
  color: #007bff;
  &:hover {
    background-color: #e6f7ff;
  }
`;
