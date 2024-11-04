import React, { useState } from "react";
import { useIsMobile } from "../../hooks";
import {
  NavbarContainer,
  MarktHeaderText,
  Hamburger,
  Backdrop,
  Sidebar,
  SearchWithMenu,
  SearchButtonMobile,
} from "./navbar.styles";
import { MenuItems } from "./menu-items";
import { SearchBar } from "../searchbar";

const Navbar = () => {
  const { isMobile } = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <NavbarContainer>
      <MarktHeaderText to={"/"}>Markt</MarktHeaderText>

      {isMobile ? (
        <SearchWithMenu>
          <SearchButtonMobile width={40} height={40} onClick={setModalIsOpen} />
          <Hamburger
            onClick={toggleSidebar}
            isOpen={isOpen}
            data-testid="hamburger"
          >
            <span />
            <span />
            <span />
          </Hamburger>
          <Backdrop
            data-testid="backdrop"
            isOpen={isOpen}
            onClick={closeSidebar}
          />
          {isOpen && (
            <Sidebar data-testid="sidebar" isOpen={isOpen}>
              <MenuItems />
            </Sidebar>
          )}
        </SearchWithMenu>
      ) : (
        <>
          <SearchBar />
          <MenuItems />
        </>
      )}
    </NavbarContainer>
  );
};

export { Navbar };
