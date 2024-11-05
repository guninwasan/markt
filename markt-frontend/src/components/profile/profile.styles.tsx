import styled from "styled-components";
import { colors } from "../../utils";

const GreetingText = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: ${colors.textBlack};
  text-align: left;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.p`
  font-size: 1.5rem;
  color: ${colors.darkGrey};
  text-align: left;
  margin: 0.5rem 0;
`;

const ProfileDetailsHeading = styled.h2`
  font-size: 2rem;
  font-weight: semi-bold;
  color: ${colors.darkGrey};
  text-align: left;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ primaryColor?: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) =>
    props.primaryColor ? colors.darkerPrimary : colors.red};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.primaryColor ? colors.darkerHoverPrimary : colors.redHover};
  }

  &:focus {
    outline: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 1.2rem;
  text-align: center;
`;

export {
  GreetingText,
  UserInfo,
  ProfileDetailsHeading,
  Button,
  ButtonContainer,
  ModalContent,
  ModalOverlay,
};
