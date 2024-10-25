import React, { useState } from "react";
import { useIsMobile } from "../../hooks";
import {
  NavbarContainer,
  MarktHeaderText,
  Hamburger,
  MobileMenuContainer,
  Backdrop,
  Sidebar,
} from "./navbar.styles";
import { MenuItems } from "./menu-items";

const Navbar = () => {
  const { isMobile } = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <NavbarContainer>
      <MarktHeaderText>Markt</MarktHeaderText>
      {isMobile ? (
        <>
          <Hamburger onClick={toggleSidebar} isOpen={isOpen}>
            <span />
            <span />
            <span />
          </Hamburger>
          <Backdrop isOpen={isOpen} onClick={closeSidebar} />
          <Sidebar isOpen={isOpen}>
            <MenuItems />
          </Sidebar>
        </>
      ) : (
        <MenuItems />
      )}
    </NavbarContainer>
  );
};

export { Navbar };
