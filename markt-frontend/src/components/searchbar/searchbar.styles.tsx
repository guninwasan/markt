import styled from "styled-components";
import { colors } from "../../utils";

export const SearchBarContainer = styled.div`
  color: ${colors.textBlack};
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
  color: ${colors.textBlack};
  outline: none;
  border-radius: 8px 8px 8px 8px; /* Rounded corners on the left side */
  &::placeholder {
    color: ${colors.grey};
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
    color: ${colors.textBlack};
    cursor: pointer;
  }
  &:focus {
    outline: none;
  }
`;
