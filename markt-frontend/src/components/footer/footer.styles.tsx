import styled from "styled-components";
import { colors } from "../../utils";

const FooterContainer = styled.footer`
  background-color: ${colors.darkerHoverPrimary};
  color: ${colors.white};
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
  border-top: 1px solid ${colors.darkGrey};
`;

const MarktText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${colors.lightGrey};
  font-weight: bold;
  text-align: center;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterLink = styled.a`
  color: ${colors.white};
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover,
  &:focus {
    color: ${colors.primary};
    text-decoration: underline;
    transform: scale(1.05);
  }
`;

const RightsReserved = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: ${colors.lightGrey};
  margin-top: 2rem;
`;

export {
  MarktText,
  FooterContainer,
  LinksContainer,
  FooterLink,
  RightsReserved,
};
