import React, { useEffect } from "react";
import {
  ModalBackground,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  ActionButton,
} from "./alert-modal.styles";

type AlertModalProps = {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  timeout?: number;
};

const AlertModal = ({
  isOpen,
  message = "Are you sure?",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  timeout = 3000,
}: AlertModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, timeout]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground data-testid="modal-background">
      <ModalContent>
        <ModalHeader>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <ActionButton onClick={onClose}>{cancelText}</ActionButton>
          {onConfirm && (
            <ActionButton onClick={onConfirm}>{confirmText}</ActionButton>
          )}
        </ModalFooter>
      </ModalContent>
    </ModalBackground>
  );
};

export { AlertModal };
