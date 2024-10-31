import React from "react";
import {
  MainContainer,
  CoverContainer,
  Title,
  Subtitle,
  RightContainer,
} from "./cover.styles";

interface CoverProps {
  children: React.ReactNode; // Accepts children for login or register form
  title: string; // Dynamic title for different forms
}

const Cover = ({ children, title }: CoverProps) => {
  return (
    <MainContainer>
      <CoverContainer>
        <Title>MARKT</Title>
        <Subtitle>
          Your Campus.
          <br />
          Your Marketplace.
        </Subtitle>
      </CoverContainer>

      <RightContainer>
        <h2>{title}</h2> {/* Dynamic title */}
        {children} {/* Dynamic form (Login or Register) */}
      </RightContainer>
    </MainContainer>
  );
};

export { Cover };
