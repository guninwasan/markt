import styled from "styled-components";
import { colors } from "../../utils";

const FormContainer = styled.form`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const ChangePasswordButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #87acbb;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #b8d3e0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export {ChangePasswordButton, ErrorText, FormContainer};