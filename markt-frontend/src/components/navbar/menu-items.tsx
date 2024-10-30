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
      {/* Common items for both logged-in and logged-out users */}
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

      {isLoggedIn ? (
        <>
          {/* Items only for logged-in users */}
          <MenuItem>
            <MenuLink as={NavLink} to="/wishlist" className={({ isActive }) => (isActive ? "active" : "")}>
              Wishlist
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink as={NavLink} to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
              Profile
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink as={NavLink} to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
              Logout
            </MenuLink>
          </MenuItem>
        </>
      ) : (
        <>
          {/* Items only for logged-out users */}
          <MenuItem>
            <MenuLink as={NavLink} to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink as={NavLink} to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
              Register
            </MenuLink>
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export { MenuItems };
