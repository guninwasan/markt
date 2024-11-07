import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectors } from "../../redux";

type ProtectedRouteProps = {
  element: React.ReactElement;
};

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const isLoggedIn = useSelector(selectors.getIsLoggedIn);

  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export { ProtectedRoute };
