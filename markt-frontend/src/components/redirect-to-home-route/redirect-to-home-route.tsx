import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectors } from "../../redux";

type ProtectedRouteProps = {
  element: React.ReactElement;
};

const RedirectToHomeRoute = ({ element }: ProtectedRouteProps) => {
  const isLoggedIn = useSelector(selectors.getIsLoggedIn);

  return !isLoggedIn ? element : <Navigate to="/" replace />;
};

export { RedirectToHomeRoute };
