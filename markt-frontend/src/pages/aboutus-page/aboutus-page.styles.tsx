import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  text-align: center;
  margin: auto;
  max-width: 800px; /* Ensures a consistent width */
`;

const AboutHeading = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center; /* Explicitly centers the heading */
`;

const AboutText = styled.div`
  font-size: 1.2rem;
  color: #555;
  line-height: 1.8;
  text-align: center; /* Centers the text */
  margin-bottom: 20px;

  p {
    margin-bottom: 1.5em; /* Adds spacing between paragraphs */
  }
`;

export {AboutText, AboutHeading, PageContainer};