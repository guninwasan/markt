import React from "react";
import {
  MainContainer,
  CoverContainer,
  RightContainer,
  Subtitle,
  Title,
} from "./cover.styles";
import { useIsMobile } from "../../hooks/use-is-mobile";

type CoverProps = {
  children: React.ReactNode;
  title: string;
};

const Cover = ({ children, title }: CoverProps) => {
  const { isMobile } = useIsMobile();

  return (
    <MainContainer>
      {!isMobile && (
        <CoverContainer>
          <Subtitle>
            Your Campus.
            <br />
            Your Marketplace.
          </Subtitle>
        </CoverContainer>
      )}

      <RightContainer>
        <Title>{title}</Title>
        {children}
      </RightContainer>
    </MainContainer>
  );
};

export { Cover };
