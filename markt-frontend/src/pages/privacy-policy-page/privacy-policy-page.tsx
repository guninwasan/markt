import React from "react";
import { Navbar } from "../../components";
import {
  PageContainer,
  PrivacyHeading,
  PrivacyText,
} from "./privacy-policy-page.styles";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <PrivacyHeading>Privacy Policy</PrivacyHeading>
        <PrivacyText>
          At Markt, your privacy is important to us. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you visit our platform. By using our platform, you agree to the
          terms outlined below.
          <br />
          <br />
          <strong>1. Information We Collect</strong>
          <br />
          - Personal Information: Name, email address, and UofT Student ID.
          <br />
          <br />
          <strong>2. How We Use Your Information</strong>
          <br />
          - To facilitate transactions between buyers and sellers.
          <br />
          <br />
          <strong>3. Sharing Your Information</strong>
          <br />
          - We do not sell your personal data to third parties.
          <br />
          <br />
          <strong>4. Security of Your Information</strong>
          <br />
          - We do our best to keep your data secure. However, no transmission
          over the internet is 100% secure.
          <br />
          <br />
          <strong>5. Your Choices</strong>
          <br />
          - You can update or delete your account at any time.
          <br />
          <br />
          <strong>6. Changes to This Privacy Policy</strong>
          <br />
          - We may update this policy periodically. Users will be notified of
          significant changes.
          <br />
          <br />
          If you have any questions about this Privacy Policy, contact us at{" "}
          <a
            href="mailto:uoft.markt@gmail.com?subject=Privacy Policy Inquiry"
            style={{ color: "#007BFF", textDecoration: "underline" }}
          >
            uoft.markt@gmail.com
          </a>
          .
        </PrivacyText>
      </PageContainer>
    </>
  );
};

export { PrivacyPolicyPage };

// Note: Contents of this page were generated by ChatGPT
