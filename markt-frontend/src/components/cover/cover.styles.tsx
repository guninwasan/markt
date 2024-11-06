import styled from "styled-components";
import { colors } from "../../utils";

const CoverContainer = styled.div`
  display: flex;
  width: 55vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${colors.darkerPrimary};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  @media (max-width: 768px) {
    display: none; 
  }
`;

const RightContainer = styled.div`
  display: flex;
  width: 45vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 3rem;
  box-sizing: border-box;
  background: ${colors.white};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  @media (max-width: 768px) {
    width: 100vw; /* Expand RightContainer to full width on mobile */
    padding: 1rem; /* Adjust padding for mobile if needed */
  }
`;

const Subtitle = styled.h2`
  font-size: 4.2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-left: 0;
  margin-right: 4.6rem;
  margin-top: 2rem;
  margin-bottom: auto;
  color: ${colors.darkGrey};

  @media (max-width: 768px) {
    font-size: 2.5rem; 
  }
`;

export { CoverContainer, RightContainer, Subtitle };
