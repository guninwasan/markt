import {
  NavbarContainer,
  Brand,
  Menu,
  MenuItem,
  MenuLink,
} from "./navbar.styles";

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
