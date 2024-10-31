import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const CoverContainer = styled.div`
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

const Title = styled.h1`
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  text-align: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 45vw;
  padding: 2rem;
`;

export { MainContainer, CoverContainer, Title, Subtitle, RightContainer };
