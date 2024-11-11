import React from "react";
import {
  ModalBackground,
  LoadingIndicator,
  LoadingText,
} from "./loading-modal.styles";

const LoadingModal = () => {
  return (
    <ModalBackground data-testid="modal-background">
      <LoadingIndicator data-testid="loading-indicator" />
      <LoadingText>Loading....</LoadingText>
    </ModalBackground>
  );
};

export { LoadingModal };
