import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.h1`
  text-align: left;
  margin-bottom: 2rem;
`;

const SubheaderContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  gap: 5rem;
  width: 70%;
`;

const Subheader = styled.h2<{ isSelected: boolean }>`
  cursor: pointer;
  font-size: 1rem;
  font-weight: normal;
  color: ${({ isSelected }) => (isSelected ? "black" : "#8F8F8F")};
  border-bottom: ${({ isSelected }) =>
    isSelected ? "2px solid black" : "none"};
  padding-bottom: 0.5rem;
`;

const ListingsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Listing = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  width: calc(33.333% - 1rem);
  box-sizing: border-box;
`;

export {
  Container,
  Header,
  SubheaderContainer,
  Subheader,
  ListingsContainer,
  Listing,
};
