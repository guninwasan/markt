import styled from "styled-components";
import { colors } from "../../utils";
import { Link } from "react-router-dom";

const LoginButton = styled.button<{ isDisabled: boolean }>`
  color: ${colors.white};
  border: none;
  padding: 1rem;

  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 0.25rem;

  background-color: ${(props) =>
    props.isDisabled ? colors.grey : colors.darkerPrimary};
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) =>
      props.isDisabled ? colors.darkGrey : colors.darkerHoverPrimary};
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorText = styled.p`
  color: ${colors.red};
`;

const LinkText = styled.div`
  margin-top: 1rem;
  color: ${colors.textBlack};
`;

const LinkStyled = styled(Link)`
  color: ${colors.textBlack};
`;

export { LoginButton, FormContainer, ErrorText, LinkText, LinkStyled };
