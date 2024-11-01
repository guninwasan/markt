import { useState } from "react";
import { useIsMobile } from "../../hooks";
import {
  Menu,
  MenuItem,
  MenuLink,
  ProfileButton,
  Dropdown,
  DropdownItem,
} from "./navbar.styles";
import { NavLink } from "react-router-dom";

const MenuItems = () => {
  const { isMobile } = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Menu isMobile={isMobile}>
      <MenuItem>
        <MenuLink
          as={NavLink}
          to="/sell"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Sell
        </MenuLink>
      </MenuItem>
      {isLoggedIn ? (
        isMobile ? (
          <>
            <MenuItem as={NavLink} to="/account">
              My Account
            </MenuItem>
            <MenuItem as={NavLink} to="/wishlist">
              Wishlist
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem>
            <ProfileButton
              onClick={toggleDropdown}
              aria-expanded={showDropdown}
            >
              Profile
            </ProfileButton>
            {showDropdown && (
              <Dropdown>
                <DropdownItem as={NavLink} to="/account">
                  My Account
                </DropdownItem>
                <DropdownItem as={NavLink} to="/wishlist">
                  Wishlist
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </Dropdown>
            )}
          </MenuItem>
        )
      ) : (
        <MenuItem>
          <MenuLink as={NavLink} to="/register">
            Login/Register
          </MenuLink>
        </MenuItem>
      )}
    </Menu>
  );
};

export { MenuItems };
