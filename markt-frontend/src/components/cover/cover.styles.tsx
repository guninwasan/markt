// cover.styles.tsx
import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

export const CoverContainer = styled.div`
  display: flex;
  width: 55vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #b6b6b6;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
`;

export const Subtitle = styled.p`
  font-size: 1.5rem;
  text-align: center;
`;

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 45vw;
  padding: 2rem;
`;
