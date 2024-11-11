import styled from "styled-components";
import { colors } from "../../utils";

const RegisterButton = styled.button`
  background-color: ${colors.darkerPrimary};
  color: ${colors.white};
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 0.25rem;

  &:disabled {
    background-color: ${colors.grey};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
export { RegisterButton };
