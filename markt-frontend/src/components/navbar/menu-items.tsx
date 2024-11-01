import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks";
import {
  Menu,
  MenuItem,
  MenuLink,
  ProfileButton,
  Dropdown,
  DropdownItem,
  ProfileIconText,
  ProfileContainer,
  LogoutButton,
} from "./navbar.styles";
import { NavLink } from "react-router-dom";

const MenuItems = () => {
  const { isMobile } = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const profileName = "Test Name";
  const dropdownRef = useRef<HTMLLIElement>(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleLogout = () => setIsLoggedIn(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderMobileMenu = () => (
    <>
      <MenuItem>
        <MenuLink to="/account">My Account</MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink to="/wishlist">Wishlist</MenuLink>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutButton>Logout</LogoutButton>
      </MenuItem>
    </>
  );

  const renderDesktopMenu = () => (
    <MenuItem ref={dropdownRef}>
      <ProfileContainer>
        <ProfileButton onClick={toggleDropdown} aria-expanded={showDropdown}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.671-10 5v1h20v-1c0-3.329-6.67-5-10-5z" />
          </svg>
        </ProfileButton>
        {profileName.length <= 10 && (
          <ProfileIconText>{profileName}</ProfileIconText>
        )}
      </ProfileContainer>
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
  );

  return (
    <Menu isMobile={isMobile}>
      <MenuItem>
        <MenuLink
          to="/sell"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Sell
        </MenuLink>
      </MenuItem>
      {isLoggedIn ? (
        isMobile ? (
          renderMobileMenu()
        ) : (
          renderDesktopMenu()
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
