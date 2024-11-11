import { Navbar, Cover, LoginForm } from "../../components";
import React from "react";

const LoginPage = () => {
  return (
    <div style={{ height: "100%" }}>
      <Navbar hideSearch />
      <Cover title="Welcome Back to UofT's Secure Marketplace!">
        <LoginForm />
      </Cover>
    </div>
  );
};

export { LoginPage };
