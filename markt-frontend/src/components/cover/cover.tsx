// cover.tsx
import React from "react";
import {
  coverContainerStyles,
  titleStyles,
  subtitleStyles,
  rightContainerStyles,
} from "./cover.styles";

interface CoverProps {
  children: React.ReactNode; // Accepts children for login or register form
  title: string; // Dynamic title for different forms
}

const Cover = ({ children, title }: CoverProps) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={coverContainerStyles}>
        <p style={subtitleStyles}>
          Your Campus.
          <br />
          Your Marketplace.
        </p>
      </div>

      <div style={rightContainerStyles}>
        <h2>{title}</h2> {/* Dynamic title */}
        {children} {/* Dynamic form (Login or Register) */}
      </div>
    </div>
  );
};

export { Cover };
