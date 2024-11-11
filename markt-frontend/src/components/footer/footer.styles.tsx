import styled from "styled-components";
import { colors } from "../../utils";

const FooterContainer = styled.footer`
  background-color: ${colors.darkerHoverPrimary};
  color: white;
  padding: 5rem 0 10rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarktText = styled.div`
  font-size: 24px;
  margin-bottom: 3rem;
  color: ${colors.darkGrey};
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const Link = styled.a`
  color: white;
  margin: 0 20px;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const RightsReserved = styled.div`
  font-size: 14px;
  margin-bottom: 3rem;
`;

export { MarktText, FooterContainer, LinksContainer, Link, RightsReserved };
