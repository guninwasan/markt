import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useIsMobile } from "./use-is-mobile";

const TestComponent = () => {
  const { isMobile } = useIsMobile();
  return <div data-testid="is-mobile">{isMobile ? "Mobile" : "Desktop"}</div>;
};

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  it("should return true if window width is less than or equal to MOBILE_BREAKPOINT", () => {
    window.innerWidth = 500;
    render(<TestComponent />);
    expect(screen.getByTestId("is-mobile").textContent).toBe("Mobile");
  });

  it("should return false if window width is greater than MOBILE_BREAKPOINT", () => {
    window.innerWidth = 800;
    render(<TestComponent />);
    expect(screen.getByTestId("is-mobile").textContent).toBe("Desktop");
  });

  it("should update isMobile on window resize", () => {
    render(<TestComponent />);

    fireEvent(window, new Event("resize", { bubbles: true, cancelable: true }));
    window.innerWidth = 500;
    fireEvent(window, new Event("resize", { bubbles: true, cancelable: true }));
    expect(screen.getByTestId("is-mobile").textContent).toBe("Mobile");

    window.innerWidth = 800;
    fireEvent(window, new Event("resize", { bubbles: true, cancelable: true }));
    expect(screen.getByTestId("is-mobile").textContent).toBe("Desktop");
  });

  it("should clean up event listeners on unmount", () => {
    const { unmount } = render(<TestComponent />);
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });
});
