import {
  NavbarContainer,
  MarktHeaderText,
  Menu,
  MenuItem,
  MenuLink,
} from "./navbar.styles";

const Navbar = () => {
  return (
    <NavbarContainer>
      <MarktHeaderText>Markt</MarktHeaderText>
      <Menu>
        <MenuItem>
          <MenuLink href="/" className="active">
            Home
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/">Buy</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/">Sell</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/login">Login/Register</MenuLink>
        </MenuItem>
      </Menu>
    </NavbarContainer>
  );
};

export { Navbar };
