import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home-page";
import { RegisterPage } from "./pages/register-page";
import ReactDOM from "react-dom/client";
import { ProductListingPage } from "./pages";
import { useIsMobile } from "./hooks";

function App() {
  useIsMobile();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listing" element={<ProductListingPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
