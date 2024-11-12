import React, { useState, useEffect } from "react";
import {
  ModalBackground,
  LoadingIndicator,
  LoadingText,
  TimerText,
  SupportLink,
} from "./loading-modal.styles";
import { useSelector } from "react-redux";
import { RootState, selectors } from "../../redux";

const LoadingModal = () => {
  const [message, setMessage] = useState<any>("");

  const { isLoading } = useSelector((state: RootState) => ({
    isLoading: selectors.getIsLoading(state),
  }));

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isLoading) {
      timer1 = setTimeout(() => {
        setMessage("Things are taking longer than usual...");
      }, 10000);

      timer2 = setTimeout(() => {
        setMessage(
          <>
            Still no luck? Try contacting support{" "}
            <SupportLink href="/support">here</SupportLink>.
          </>
        );
      }, 20000);
    } else {
      setMessage("");
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <ModalBackground data-testid="modal-background">
      <LoadingIndicator data-testid="loading-indicator" />
      <LoadingText>Loading....</LoadingText>
      {message && <TimerText>{message}</TimerText>}
    </ModalBackground>
  );
};

export { LoadingModal };
