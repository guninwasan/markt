import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

export const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};
