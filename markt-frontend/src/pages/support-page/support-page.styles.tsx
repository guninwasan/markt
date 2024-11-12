import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  text-align: center;
  margin: auto;
  max-width: 800px;
`;

export const SupportHeading = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
`;

export const SupportText = styled.div`
  font-size: 1.2rem;
  color: #555;
  line-height: 1.8;
  text-align: center;
  margin-bottom: 20px;

  a {
    color: #007BFF;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SupportLink = styled.a`
  color: #007BFF;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
