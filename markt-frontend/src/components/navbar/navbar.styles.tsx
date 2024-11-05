import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { colors } from "../../utils";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background-color: ${colors.primary};
  color: ${colors.textBlack};
`;

const MarktHeaderText = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: 1000;
  color: ${colors.textBlack};
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
`;

const Menu = styled.ul<{ isMobile?: boolean | null }>`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: ${({ isMobile }) => (isMobile ? "2rem" : "0")};
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
`;

const MenuItem = styled.li`
  margin-left: 1rem;
  cursor: pointer;
  position: relative;
`;

const MenuLink = styled(NavLink)`
  color: ${colors.textBlack};
  text-decoration: none;
  padding: 0.5rem 1rem;

  &.active {
    background-color: #555;
    border-radius: 4px;
    color: #f9f9f9;
  }
`;

const LogoutButton = styled.div`
  color: ${colors.textBlack};
  text-decoration: none;
  padding: 0.5rem 1rem;
`;

const Hamburger = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;

  span {
    width: 1.5rem;
    height: 0.2rem;
    background: ${colors.black};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }

  span:nth-child(1) {
    transform: ${({ isOpen }) => (isOpen ? "rotate(45deg)" : "rotate(0)")};
  }

  span:nth-child(2) {
    opacity: ${({ isOpen }) => (isOpen ? "0" : "1")};
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(20px)" : "translateX(0)"};
  }

  span:nth-child(3) {
    transform: ${({ isOpen }) => (isOpen ? "rotate(-45deg)" : "rotate(0)")};
  }
`;

const MobileMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Backdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 999;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  height: 100vh;
  width: 90vw;
  background-color: ${colors.lightGrey};
  position: fixed;
  top: 4.5rem;
  right: 0;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-direction: column;
`;

const ProfileButton = styled.button`
  background-color: #e0e0e0;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #d0d0d0;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #333;
  }
`;

const ProfileIconText = styled.span`
  font-size: 0.75rem;
  color: ${colors.textBlack};
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  transform: translateX(calc(0%));
  background-color: ${colors.white};
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  padding: 0.5rem 0;
  width: 150px;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  color: ${colors.textBlack};
  text-decoration: none;

  &:hover {
    background-color: #f0f0f0;
    color: ${colors.textBlack};
  }
`;

const SearchWithMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchButtonMobile = styled(FaSearch)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SpotlightModal = styled.div`
  background-color: #f0f0f0;
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  min-height: 100px;
`;

export {
  NavbarContainer,
  MarktHeaderText,
  Menu,
  MenuItem,
  MenuLink,
  Hamburger,
  MobileMenuContainer,
  Backdrop,
  Sidebar,
  ProfileButton,
  ProfileIconText,
  Dropdown,
  DropdownItem,
  ProfileContainer,
  LogoutButton,
  SearchWithMenu,
  SearchButtonMobile,
  ModalBackdrop,
  SpotlightModal,
};
