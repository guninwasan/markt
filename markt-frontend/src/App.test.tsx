import { render, screen } from "@testing-library/react";
import App from "./App";

const marktHomePageText = "Markt Home Page";
jest.mock("./pages/home-page", () => ({
  HomePage: () => <div>{marktHomePageText}</div>,
}));

describe("App", () => {
  it("should render the app properly and then home page", () => {
    render(<App />);
    const homePage = screen.getByText(marktHomePageText);
    expect(homePage).toBeInTheDocument();
  });
});
