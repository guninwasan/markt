import styled from 'styled-components';

export const SearchBarContainer = styled.div`
  width: 100vw;
  height: 4rem;
  border: 3px solid #C5C5C5;
  background: #B6B6B6;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InnerSearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33vw;
  max-width: 1024px;
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Ensures the children respect the rounded corners */
`;

export const SearchInput = styled.input`
  width: 27vw;
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
  color: #999;
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
