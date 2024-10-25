import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProductListingPage } from "./pages";
import { useIsMobile } from "./hooks";
import { HomePage } from "./pages/home-page";

function App() {
  useIsMobile();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing" element={<ProductListingPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
