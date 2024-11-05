import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GreetingText, UserInfo, ProfileDetailsHeading, ButtonContainer, LogoutButton, ModalOverlay, ModalContent } from "./profile.styles";
import styled from "styled-components";

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const userName = "test user";
  const userEmail = "testuser@example.com";
  const userPhone = "9999999999";
  const userID = "55555";

  // HANDLE LOGOUT NEEDS TO BE MODIFIED TO REVOKE LOGGED IN USER RIGHTS

  const handleLogout = () => {
    setIsModalVisible(true);

    setTimeout(() => {
      setIsModalVisible(false); 
      navigate("/"); 
    }, 2000); 
  };

  //CHANGE PASSWORD FUNCTIONALITY NEEDS TO BE ADDED
  const handleChangePassword = () => {
    console.log("Changing password");
  };

  return (
    <div>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <GreetingText>Hello, {userName}</GreetingText>
        <ProfileDetailsHeading>Profile Details:</ProfileDetailsHeading>
        <UserInfo>UofT Email Address: {userEmail}</UserInfo>
        <UserInfo>Phone No.: {userPhone}</UserInfo>
        <UserInfo>UofT Student ID: {userID}</UserInfo>

        <ButtonContainer>
          <LogoutButton onClick={handleChangePassword}>Change Password</LogoutButton>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ButtonContainer>
      </div>

      {isModalVisible && (
        <ModalOverlay>
          <ModalContent>
            You have been logged out.
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export { Profile };
