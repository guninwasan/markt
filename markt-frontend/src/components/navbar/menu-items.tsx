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
  StyledProfilePhoto,
  SellButton,
  SellItem,
} from "./navbar.styles";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, selectors, setIsLoggedIn } from "../../redux";

const MenuItems = () => {
  const { isMobile } = useIsMobile();
  const dispatch = useDispatch();
  const { isLoggedIn, name } = useSelector((state: RootState) => ({
    isLoggedIn: selectors.getIsLoggedIn(state),
    name: selectors.getName(state),
  }));

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    localStorage.removeItem("jwt");
    window.location.reload();
  };

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

  const MobileMenu = () => (
    <>
      <MenuItem>
        <MenuLink to="/sell">Sell</MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink to="/profile">My Profile</MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink to="/wishlist">Wishlist</MenuLink>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutButton>Logout</LogoutButton>
      </MenuItem>
    </>
  );

  const DesktopMenu = () => (
    <>
      <MenuItem>
        <SellItem as={NavLink} to="/sell">
          <SellButton>Sell</SellButton>
        </SellItem>
      </MenuItem>
      <MenuItem ref={dropdownRef}>
        <ProfileContainer>
          <ProfileButton
            onClick={toggleDropdown}
            aria-expanded={showDropdown}
            data-testid="profile"
          >
            <StyledProfilePhoto src={"/profile-photo.svg"} alt="Profile" />
          </ProfileButton>
          {name && name.length <= 10 && (
            <ProfileIconText>{name}</ProfileIconText>
          )}
        </ProfileContainer>
        {showDropdown && (
          <Dropdown>
            <DropdownItem as={NavLink} to="/profile">
              My Profile
            </DropdownItem>
            <DropdownItem as={NavLink} to="/wishlist">
              Wishlist
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </Dropdown>
        )}
      </MenuItem>
    </>
  );

  return (
    <Menu isMobile={isMobile}>
      {isLoggedIn ? (
        isMobile ? (
          <MobileMenu />
        ) : (
          <DesktopMenu />
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
