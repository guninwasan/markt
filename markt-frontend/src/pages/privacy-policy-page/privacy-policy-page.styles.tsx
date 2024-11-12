import styled from "styled-components";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PrivacyHeading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const PrivacyText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  white-space: pre-wrap;

  a {
    color: #007bff;
    text-decoration: underline;
  }

  a:hover {
    color: #0056b3;
  }
`;

export {PrivacyText, PrivacyHeading, PageContainer};
