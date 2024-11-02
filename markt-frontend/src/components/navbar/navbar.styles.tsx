import styled from "styled-components";
import { NavLink } from "react-router-dom";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background-color: #d9d9d9;
`;

const MarktHeaderText = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: 1000;
  color: #333;
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
  color: #000000;
  text-decoration: none;
  padding: 0.5rem 1rem;

  &.active {
    background-color: #555;
    border-radius: 4px;
    color: #f9f9f9;
  }
`;

const LogoutButton = styled.div`
  color: #000000;
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
    background: #000000;
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
  background-color: red;
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
  background-color: #d9d9d9;
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
  background-color: #e0e0e0; /* Light gray background for the circle */
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  border-radius: 50%; /* Makes the button circular */
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #d0d0d0; /* Slightly darker on hover */
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #333; /* Icon color */
  }
`;

const ProfileIconText = styled.span`
  font-size: 0.75rem;
  color: #333;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  transform: translateX(calc(0%)); /* Positions dropdown to the left */
  background-color: #ffffff;
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
  color: #333;
  text-decoration: none;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
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
};
