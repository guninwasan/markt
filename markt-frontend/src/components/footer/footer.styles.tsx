import styled from "styled-components";
import { colors } from "../../utils";

const FooterContainer = styled.footer`
  background-color: ${colors.darkerHoverPrimary};
  color: ${colors.white};
  margin-top: 4rem;
  padding: 2rem;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
  border-top: 1px solid ${colors.darkGrey};
`;

const MarktText = styled.p`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 2.5rem;
  background: linear-gradient(
    90deg,
    ${colors.primary} 0%,
    ${colors.lightGrey} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;

  i {
    font-weight: 400;
    color: ${colors.lightGrey};
  }
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
