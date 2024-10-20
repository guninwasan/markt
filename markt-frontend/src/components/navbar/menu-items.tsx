import { Menu, MenuItem, MenuLink } from "./navbar.styles";

const MenuItems = () => (
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
      <MenuLink href="/">Login/Register</MenuLink>
    </MenuItem>
  </Menu>
);

export { MenuItems };
