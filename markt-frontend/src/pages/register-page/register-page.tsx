import { Navbar, Cover, RegisterForm } from "../../components";
import React from "react";

const RegisterPage = () => {
  return (
    <div style={{ height: "100%" }}>
      <Navbar hideSearch />
      <Cover title="Join UofT’s Secure Marketplace Community Today!">
        <RegisterForm />
      </Cover>
    </div>
  );
};

export { RegisterPage };
