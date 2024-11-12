import styled from "styled-components";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TermsHeading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const TermsText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  white-space: pre-wrap;
`;

const IntroText = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  font-weight: 500;
  color: #444;
  background-color: #f9f9f9;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const EmailLink = styled.a`
  color: #007bff;
  text-decoration: underline;
  font-weight: bold;

  &:hover {
    color: #0056b3;
  }
`;

export {TermsText, TermsHeading, PageContainer, IntroText, EmailLink};