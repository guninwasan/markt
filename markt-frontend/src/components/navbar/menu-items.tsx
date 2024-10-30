import { useIsMobile } from "../../hooks";
import { useSelector } from "react-redux"; // Import useSelector
import { selectors } from "../../redux"; // Import selectors
import { Menu, MenuItem, MenuLink } from "./navbar.styles";
import { NavLink } from "react-router-dom";

const MenuItems = () => {
  const { isMobile } = useIsMobile();
  
  // Retrieve isLoggedIn from Redux
  const isLoggedIn = useSelector(selectors.getIsLoggedIn);

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
        {/* Conditionally render Login or Register based on isLoggedIn */}
        <MenuLink as={NavLink} to={isLoggedIn ? "/register" : "/login"} className={({ isActive }) => (isActive ? "active" : "")}>
          {isLoggedIn ? "Register" : "Login"}
        </MenuLink>
      </MenuItem>
    </Menu>
  );
};

export { MenuItems };
