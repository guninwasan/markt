import React, { useState } from "react";
import { useIsMobile } from "../../hooks";
import {
  NavbarContainer,
  MarktHeaderText,
  HamburgerIcon,
  MobileMenuContainer,
} from "./navbar.styles";
import { MenuItems } from "./menu-items";

const Navbar = () => {
  const { isMobile } = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NavbarContainer>
      <MarktHeaderText>Markt</MarktHeaderText>
      {isMobile ? (
        <>
          <HamburgerIcon onClick={toggleMenu}>☰</HamburgerIcon>
          {isMenuOpen && (
            <MobileMenuContainer>
              <MenuItems />
            </MobileMenuContainer>
          )}
        </>
      ) : (
        <MenuItems />
      )}
    </NavbarContainer>
  );
};

export { Navbar };
