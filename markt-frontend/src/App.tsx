import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  SellPage,
  ProfilePage,
  NotFoundPage,
  SearchPage,
  ProductListingPage,
} from "./pages";
import { useIsMobile } from "./hooks";
import {
  LoadingModal,
  ProtectedRoute,
  RedirectToHomeRoute,
} from "./components";
import { useSelector } from "react-redux";
import { RootState, selectors } from "./redux";

function App() {
  const { isLoading } = useSelector((state: RootState) => ({
    isLoading: selectors.getIsLoading(state),
  }));

  return (
    <>
      {isLoading && <LoadingModal />}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<RedirectToHomeRoute element={<LoginPage />} />}
          />
          <Route
            path="/register"
            element={<RedirectToHomeRoute element={<RegisterPage />} />}
          />
          <Route path="/listing" element={<ProductListingPage />} />
          <Route
            path="/sell"
            element={<ProtectedRoute element={<SellPage />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage />} />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
