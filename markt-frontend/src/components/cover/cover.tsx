import React from "react";
import { CoverContainer, RightContainer, Subtitle } from "./cover.styles";

type CoverProps = {
  children: React.ReactNode;
  title: string;
};

const Cover = ({ children, title }: CoverProps) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <CoverContainer>
        <Subtitle>
          Your Campus.
          <br />
          Your Marketplace.
        </Subtitle>
      </CoverContainer>

      <RightContainer>
        <h2>{title}</h2>
        {children}
      </RightContainer>
    </div>
  );
};

export { Cover };
