import styled from "styled-components";
import { colors } from "../../utils";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: ${colors.white};
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 80%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin: 20px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${colors.darkerPrimary};
  color: white;
  &:hover {
    background: ${colors.darkerHoverPrimary};
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  text-align: center;
`;

export {
  ModalBackground,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  ModalFooter,
  ActionButton,
  LoadingText,
};
