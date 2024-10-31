// login-page.tsx
import { ExploreListings, Navbar, Cover, LoginForm } from "../../components";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <Cover title="Welcome Back to UofT's Secure Marketplace!">
        <LoginForm />
      </Cover>
    </div>
  );
};

export { LoginPage };
