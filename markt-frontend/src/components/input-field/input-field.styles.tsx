import styled from "styled-components";
import { colors } from "../../utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: ${colors.lightGrey};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 0.5rem 1rem;
  width: 100%;
  border: none;
  transition: background 0.3s ease;
  height: 2.625rem;

  &:focus {
    background: ${colors.white};
    outline: none;
    box-shadow: 0px 0px 5px 2px ${colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;

export { Container, InputWrapper, Input, ErrorMessage };
