import styled from "styled-components";
import { colors } from "../../utils";

const MainContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
  margin-bottom: 5rem;
`;

const CoverContainer = styled.div`
  flex: 1;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${colors.darkerPrimary};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  padding: 2rem;
`;

const RightContainer = styled.div`
  flex: 1.1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 3rem;
  background: ${colors.white};
  gap: 3rem;
`;

const Title = styled.h2`
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 5rem;
  color: ${colors.darkGrey};
`;

const Subtitle = styled.h2`
  font-size: 4.2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 2rem;
  margin-bottom: auto;
  color: ${colors.darkGrey};
`;

export { MainContainer, CoverContainer, RightContainer, Subtitle, Title };
