import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, SellPage, ProfilePage } from "./pages";
import { ProductListingPage } from "./pages";
import { useIsMobile } from "./hooks";

function App() {
  useIsMobile();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listing" element={<ProductListingPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
