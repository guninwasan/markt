import React from "react";
import {
  ModalBackground,
  LoadingIndicator,
  LoadingText,
} from "./loading-modal.styles";

const LoadingModal = () => {
  return (
    <ModalBackground>
      <LoadingIndicator />
      <LoadingText>Loading....</LoadingText>
    </ModalBackground>
  );
};

export { LoadingModal };
