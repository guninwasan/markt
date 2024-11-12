import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlertModal } from "./alert-modal";

describe("AlertModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    message: "Test message",
    confirmText: "Confirm",
    cancelText: "Cancel",
    timeout: 3000,
  };

  it("renders correctly when open", () => {
    render(<AlertModal {...defaultProps} />);
    expect(screen.getByTestId("modal-background")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<AlertModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("modal-background")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    render(<AlertModal {...defaultProps} />);
    fireEvent.click(screen.getByText("×"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onClose when the cancel button is clicked", () => {
    render(<AlertModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    render(<AlertModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it("calls onClose after timeout", () => {
    jest.useFakeTimers();
    render(<AlertModal {...defaultProps} />);
    jest.advanceTimersByTime(defaultProps.timeout);
    expect(defaultProps.onClose).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
