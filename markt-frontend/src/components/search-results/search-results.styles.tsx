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
  color: ${colors.textBlack};
`;

const NoResultsText = styled.p`
  font-size: 1rem;
  color: ${colors.textBlack};
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
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
