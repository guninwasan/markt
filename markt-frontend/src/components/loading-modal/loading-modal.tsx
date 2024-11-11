import React, { useState, useEffect } from "react";
import {
  ModalBackground,
  LoadingIndicator,
  LoadingText,
  TimerText,
  SupportLink,
} from "./loading-modal.styles";

const LoadingModal = () => {
  const [message, setMessage] = useState<any>("");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessage("Things are taking longer than usual...");
    }, 10000);

    const timer2 = setTimeout(() => {
      setMessage(
        <>
          Still no luck? Try contacting support{" "}
          <SupportLink href="/support">here</SupportLink>.
        </>
      );
    }, 20000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <ModalBackground data-testid="modal-background">
      <LoadingIndicator data-testid="loading-indicator" />
      <LoadingText>Loading....</LoadingText>
      {message && <TimerText>{message}</TimerText>}
    </ModalBackground>
  );
};

export { LoadingModal };
