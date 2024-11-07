import React from "react";
import { CoverContainer, RightContainer, Subtitle } from "./cover.styles";
import { useIsMobile } from "../../hooks/use-is-mobile"; 

type CoverProps = {
  children: React.ReactNode;
  title: string;
};

const Cover = ({ children, title }: CoverProps) => {
  const { isMobile } = useIsMobile(); 

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
        <h2>{title}</h2>
        {children}
      </RightContainer>
    </div>
  );
};

export { Cover };
