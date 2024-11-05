import React from "react";
import { Navbar } from "../../components"; 
import { PageContainer, NotFoundHeading, Message, GameContainer } from "./notfound-page.styles";

const NotFoundPage = () => {
  return (
    <div>
      <Navbar />
      <PageContainer>
        <NotFoundHeading>Page Not Found</NotFoundHeading>
        <Message>Oops! It looks like the page you are looking for does not exist. Enjoy this game while we have you here!</Message>
        <GameContainer>
            <iframe 
                src="https://chromedino.com/" 
                title="Dino Game"
                width="100%" 
                height="100%"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
            ></iframe>
        </GameContainer>
      </PageContainer>
    </div>
  );
};

export { NotFoundPage };
