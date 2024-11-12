import React from "react";
import { Navbar } from "../../components";
import { PageContainer, AboutHeading, AboutText } from "./aboutus-page.styles";

const AboutPage = () => {
  return (
    <>
      <Navbar hideSearch/>
      <PageContainer>
        <AboutHeading>About Us</AboutHeading>
        <AboutText>
            <p>
                We are a team of five Computer Engineering students from the University of Toronto, united by our passion for software development. Driven by a shared commitment to innovation and excellence, we aim to create impactful solutions that address real-world challenges.
            </p>
            <p>
                We recognized a need within our university community for a safe and secure second-hand marketplace. Many students own books and furniture that are only used for a few years and remain in excellent condition due to minimal use. Selling these items can be mutually beneficial: sellers earn money by parting with items they no longer need, and buyers save money by avoiding high retail prices for items they will use temporarily. Motivated to address this need, we developed this platform to provide an efficient solution for students.
            </p>
        
        </AboutText>
      </PageContainer>
    </>
  );
};

export { AboutPage };
