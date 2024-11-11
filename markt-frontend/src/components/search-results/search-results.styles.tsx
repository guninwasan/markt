import styled from "styled-components";
import { colors } from "../../utils";

const SearchResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem;
`;

const NoResultsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  flex-direction: column;
`;

const NoResultsHeading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${colors.textBlack};
`;

const NoResultsText = styled.p`
  font-size: 1rem;
  color: ${colors.textBlack};
`;

const ResultsContainer = styled.div`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem;
  color: ${colors.textBlack};
`;

export {
  SearchResultsContainer,
  NoResultsContainer,
  NoResultsHeading,
  NoResultsText,
  ResultsContainer,
};

// New Pagination Container styles
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

// New Pagination Button styles
export const PaginationButton = styled.button`
  padding: 8px 16px;
  margin: 0 10px;
  cursor: pointer;
  background-color:  ${colors.darkerPrimary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${colors.darkGrey};
  }
`;

export const SortByContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: auto; /* Align it to the right */
  font-size: 16px;
`;

export const SortBySelect = styled.select`
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 30px; /* Rounded corners */
  border: 1px solid #ccc; /* Light border color */
  background-color: #f7f7f7; /* Subtle background color */
  font-size: 14px;
  font-weight: 500;
  color: #333; /* Dark text color */
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  /* Hover effect */
  &:hover {
    background-color: #f1f1f1;
    border-color: #888;
  }

  /* Focus effect */
  &:focus {
    background-color: #fff;
    border-color: #007bff;
    outline: none;
  }

  /* Custom dropdown arrow */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6"%3E%3Cpath d="M0 0l5 5 5-5z"%3E%3C/path%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
`;

export const SortByOption = styled.option`
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  /* Hover effect for options */
  &:hover {
    background-color: #f1f1f1;
  }
`;
