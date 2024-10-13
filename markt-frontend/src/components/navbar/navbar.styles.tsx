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

const Menu = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
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

export { NavbarContainer, MarktHeaderText, Menu, MenuItem, MenuLink };
