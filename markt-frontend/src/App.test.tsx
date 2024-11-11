import { render, screen } from "@testing-library/react";
import App from "./App";
import { store } from "./redux";
import { Provider } from "react-redux";

const marktHomePageText = "Markt Home Page";
jest.mock("./pages/home-page", () => ({
  HomePage: () => <div>{marktHomePageText}</div>,
}));

describe("App", () => {
  it("should render the app properly and then home page", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const homePage = screen.getByText(marktHomePageText);
    expect(homePage).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
