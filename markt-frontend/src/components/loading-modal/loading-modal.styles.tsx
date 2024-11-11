import styled from "styled-components";
import { colors } from "../../utils";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingIndicator = styled.div`
  width: 100px;
  height: 100px;
  border: 7px solid ${colors.lightGrey};
  border-top: 10px solid ${colors.darkerHoverPrimary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  width: 100%;
  font-weight: bold;
  color: ${colors.white};
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-left: 1.4rem;
`;

export { ModalBackground, LoadingIndicator, LoadingText };
