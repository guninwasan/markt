import React from "react";
import { render, screen } from "@testing-library/react";
import { Cover } from "./cover";
import { useIsMobile } from "../../hooks/use-is-mobile";

jest.mock("../../hooks/use-is-mobile");

const mockUseIsMobile = useIsMobile as jest.Mock;

describe("Cover", () => {
  const title = "Test Title";
  const children = <div>Test Children</div>;

  beforeEach(() => {
    mockUseIsMobile.mockClear();
  });

  it("should render the title and children", () => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });

    render(<Cover title={title}>{children}</Cover>);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  it("should render the subtitle when not on mobile", () => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });

    render(<Cover title={title}>{children}</Cover>);

    expect(screen.getByText(/Your Campus./)).toBeInTheDocument();
    expect(screen.getByText(/Your Marketplace./)).toBeInTheDocument();
  });

  it("should not render the subtitle when on mobile", () => {
    mockUseIsMobile.mockReturnValue({ isMobile: true });

    render(<Cover title={title}>{children}</Cover>);

    expect(screen.queryByText("Your Campus.")).not.toBeInTheDocument();
    expect(screen.queryByText("Your Marketplace.")).not.toBeInTheDocument();
  });

  it("should match snapshot", () => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });

    const { container } = render(<Cover title={title}>{children}</Cover>);

    expect(container).toMatchSnapshot();
  });
});
