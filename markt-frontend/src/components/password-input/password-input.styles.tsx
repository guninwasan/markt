import styled, { keyframes } from "styled-components";
import { colors } from "../../utils";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const colorChange = keyframes`
  from {
    color: #666;
  }
  to {
    color: green;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Input = styled.input<{ showPassword: boolean }>`
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: ${colors.lightGrey};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 0.5rem 1rem;
  padding-right: 4rem;
  width: 100%;
  border: none;
  transition: background 0.3s ease;
  height: 2.625rem;

  &:focus {
    background: ${colors.white};
    outline: none;
    box-shadow: 0px 0px 5px 2px ${colors.primary};
  }

  ${({ showPassword }) =>
    showPassword &&
    `
    -webkit-text-security: none; 
    text-security: none; 
  `}
`;

const EyeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  font-size: 1.5rem;
  color: ${colors.textBlack};
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.darkGrey};
  }
`;

const Requirements = styled.ul`
  list-style: none;
  padding-left: 0;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const RequirementItem = styled.li<{ fulfilled: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ fulfilled }) => (fulfilled ? "green" : "#666")};
  transition: color 0.3s ease;
  animation: ${({ fulfilled }) => (fulfilled ? colorChange : "none")} 0.5s
    ease-in-out;

  & > svg {
    margin-right: 8px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;

export {
  Container,
  PasswordWrapper,
  Input,
  EyeButton,
  Requirements,
  RequirementItem,
  ErrorMessage,
};
