import styled from "styled-components";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background-color: #d9d9d9;
`;

const MarktHeaderText = styled.div`
  font-size: 1.5rem;
  font-weight: 1000;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 2px;
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
`;

const MenuLink = styled.a`
  color: #000000;
  text-decoration: none;
  padding: 0.5rem 1rem;

  &.active {
    background-color: #555;
    border-radius: 4px;
    color: #f9f9f9;
  }
`;

const Hamburger = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem; // Reduced size
  height: 1.5rem; // Reduced size
  cursor: pointer;

  span {
    width: 1.5rem; // Reduced size
    height: 0.2rem; // Reduced size
    background: #000000; // Lighter color for less boldness
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
  z-index: 999; /* Ensure the backdrop is below the sidebar */
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  height: 100vh;
  width: 70vw;
  max-width: 200px;
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
};
