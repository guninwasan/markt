import React from "react";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
`;

const Brand = styled.div`
  font-size: 1.5rem;
`;

const Menu = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  margin-left: 1rem;
`;

const MenuLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;

  &.active {
    background-color: #555;
    border-radius: 4px;
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Brand>
        <a href="/">Markt</a>
      </Brand>
      <Menu>
        <MenuItem>
          <MenuLink href="/" className="active">
            Home
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/buy">Buy</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/sell">Sell</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/login">Login/Register</MenuLink>
        </MenuItem>
      </Menu>
    </NavbarContainer>
  );
};

export { Navbar };
