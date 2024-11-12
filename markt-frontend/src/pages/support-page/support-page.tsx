import React from "react";
import { Navbar } from "../../components";
import { PageContainer, SupportHeading, SupportText, SupportLink } from "./support-page.styles";

const SupportPage = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <SupportHeading>Support</SupportHeading>
        <SupportText>
          Need assistance? We are here to help! Whether you are experiencing issues with our platform or have questions, our team is ready to provide support.
          <br /><br />
          You can share any concerns that you have through our <SupportLink href="https://forms.gle/T9WsYo6zLYCW22k86" target="_blank">Bug Report Form</SupportLink>. We appreciate your feedback. We will get back to you soon!
        </SupportText>
      </PageContainer>
    </>
  );
};

export { SupportPage };
