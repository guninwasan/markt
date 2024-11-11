import React from "react";
import {
  FooterContainer,
  LinksContainer,
  FooterLink,
  RightsReserved,
  MarktText,
} from "./footer.styles";

const Footer = () => {
  return (
    <FooterContainer>
      <MarktText>
        MARKT by <i>Mizzica</i>
      </MarktText>
      <nav aria-label="Footer navigation">
        <LinksContainer>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms-of-use">Terms of Use</FooterLink>
          <FooterLink href="/support">Support / Report an issue</FooterLink>
        </LinksContainer>
      </nav>
      <RightsReserved>© 2024 All rights reserved.</RightsReserved>
    </FooterContainer>
  );
};

export { Footer };
