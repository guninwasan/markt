import { useIsMobile } from "../../hooks";
import { Menu, MenuItem, MenuLink } from "./navbar.styles";
import { NavLink } from "react-router-dom";

const MenuItems = () => {
  const { isMobile } = useIsMobile();

  return (
    <Menu isMobile={isMobile}>
      <MenuItem>
        <MenuLink as={NavLink} to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/buy" className={({ isActive }) => (isActive ? "active" : "")}>
          Buy
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/sell" className={({ isActive }) => (isActive ? "active" : "")}>
          Sell
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/wishlist" className={({ isActive }) => (isActive ? "active" : "")}>
          Wishlist
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
          Login/Register
        </MenuLink>
      </MenuItem>
    </Menu>
  );
};

export { MenuItems };

// Used GPT to change from href to navlink