import { ExploreListings, Navbar, Cover } from "../../components";
import React, { useState } from 'react';

const LoginPage = () => {

  // State to handle email and password inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here (e.g., API calls)
    console.log('Logging in with:', { email, password });
  }

  return (
    <div>
      <Navbar />
      <Cover />

    </div>
  );
};
export { LoginPage };
