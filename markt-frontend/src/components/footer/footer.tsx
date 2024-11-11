import React from "react";
import {
  FooterContainer,
  LinksContainer,
  Link,
  RightsReserved,
  MarktText,
} from "./footer.styles";

const Footer = () => {
  return (
    <FooterContainer>
      <MarktText>
        MARKT by <i>Mizzica</i>
      </MarktText>
      <LinksContainer>
        <Link href="#">About</Link>
        <Link href="#">Privacy Policy</Link>
        <Link href="#">Terms of Use</Link>
        <Link href="#">Support / Report an issue</Link>
      </LinksContainer>
      <RightsReserved>
        © {new Date().getFullYear()} All rights reserved.
      </RightsReserved>
    </FooterContainer>
  );
};

export { Footer };
