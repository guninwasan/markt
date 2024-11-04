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
  ModalBackdrop,
  SpotlightModal,
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

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <NavbarContainer>
      <MarktHeaderText to={"/"}>Markt</MarktHeaderText>

      {isMobile ? (
        <SearchWithMenu>
          <SearchButtonMobile width={40} height={40} onClick={toggleModal} />
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
          {modalIsOpen && isMobile && (
            <ModalBackdrop onClick={toggleModal}>
              <SpotlightModal onClick={(e) => e.stopPropagation()}>
                <SearchBar />
              </SpotlightModal>
            </ModalBackdrop>
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
