import React from "react";
import { Navbar } from "../../components";
import { PageContainer, SupportHeading, SupportText } from "./support-page.styles";
import { colors } from "../../utils";

const SupportPage = () => {
  return (
    <>
      <Navbar />
      <PageContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SupportHeading>Support</SupportHeading>
        <SupportText>
          Need assistance? We are here to help! Whether you are experiencing issues with our platform or have questions, our team is ready to provide support.
          <br /><br />
          Please fill out the form below to share any concerns you may have. We appreciate your feedback and will get back to you soon!
          <br /><br />
          If the form does not open, please{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeJgGzouA1OvvQ-_mrEWQ40brS4W7_uKVaq5LqrZSFEMVzd-w/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: colors.darkerPrimary,
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            click here
          </a>{" "}
          to access the form.
        </SupportText>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeJgGzouA1OvvQ-_mrEWQ40brS4W7_uKVaq5LqrZSFEMVzd-w/viewform?embedded=true"
          width="100%"
          height="1200px"
          frameBorder="0"
          title="Bug Report Form"
          style={{
            border: "none",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
        />
      </PageContainer>
    </>
  );
};

export { SupportPage };
