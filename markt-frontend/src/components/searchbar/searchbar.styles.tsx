import styled from "styled-components";
import { colors } from "../../utils";

export const SearchBarContainer = styled.div`
  color: ${colors.textBlack};
  display: flex;
  position: relative;
  margin-right: 22%;
  align-items: center;
  width: 100%;
`;

export const InnerSearchBarContainer = styled.div`
  width: 100%;
  min-width: 250px;
  display: flex;
  align-items: center;
  position: relative;
`;

export const SearchInput = styled.input`
  height: 2rem;
  width: 100%;
  border: none;
  padding-left: 1rem;
  font-size: 1.25rem;
  font-weight: 300;
  color: ${colors.textBlack};
  outline: none;
  border-radius: 8px; /* Fully rounded corners */
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
  &:hover {
    color: ${colors.textBlack};
  }
  &:focus {
    outline: none;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100%);
  left: 0;
  width: inherit;
  max-width: calc(100% - 40px);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px; /* Add border-radius to make sure only first and last items have rounded corners */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  overflow: hidden;
`;

export const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  &:hover {
    background-color: ${colors.lightGrey};
  }

  /* Apply border radius to the first and last items */
  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-bottom: none; /* Remove border-bottom on last item */
  }
`;
