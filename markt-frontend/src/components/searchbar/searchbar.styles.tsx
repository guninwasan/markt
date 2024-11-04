import styled from "styled-components";

export const SearchBarContainer = styled.div`
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  padding-left: 1rem; /* Add space for the search icon */
  font-size: 1.25rem;
  font-weight: 300; /* Lighter font weight */
  color: #333;
  outline: none;
  border-radius: 8px 8px 8px 8px; /* Rounded corners on the left side */
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
  border-radius: 0 8px 8px 0; /* Rounded corners on the right side */
  &:hover {
    color: #333;
  }
  &:focus {
    outline: none;
  }
`;
