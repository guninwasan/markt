import React, { useEffect, useRef } from "react";
import { Navbar } from "../../components";
import {
  PageContainer,
  NotFoundHeading,
  Message,
  GameContainer,
} from "./notfound-page.styles";

const NotFoundPage = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, []);

  return (
    <>
      <Navbar hideSearch/>
      <PageContainer>
        <NotFoundHeading>Page Not Found</NotFoundHeading>
        <Message>
          Oops! It looks like the page you are looking for does not exist. Enjoy
          this game while we have you here!
        </Message>
        <GameContainer>
          <iframe
            ref={iframeRef}
            src="https://chromedino.com/"
            title="Dino Game"
            width="100%"
            height="100%"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
          ></iframe>
        </GameContainer>
      </PageContainer>
    </>
  );
};

export { NotFoundPage };
