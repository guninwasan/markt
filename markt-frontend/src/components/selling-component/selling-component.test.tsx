import React from "react";
import { SellingComponent } from "./selling-component";
import { renderWithRedux } from "../../utils/render-with-redux";
import { useSelector } from "react-redux";
import { screen } from "@testing-library/react";

jest.mock("./sections", () => ({
  EssentialDetails: () => <div>EssentialDetails Component</div>,
  MediaSection: () => <div>MediaSection Component</div>,
  ProductFlairs: () => <div>ProductFlairs Component</div>,
  Specifications: () => <div>Specifications Component</div>,
  AdditionalDetails: () => <div>AdditionalDetails Component</div>,
}));

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("SellingComponent", () => {

  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockReturnValue({ email: "email@email.com" });
    jest.useFakeTimers();
  });

  it("should render the component", () => {
    renderWithRedux(<SellingComponent />);
    expect(screen.getByText(/List Your Product/i)).toBeInTheDocument();
  });
  

  it("should render all sections", () => {
    const { getByText } = renderWithRedux(<SellingComponent />);
    expect(getByText("EssentialDetails Component")).toBeInTheDocument();
    expect(getByText("MediaSection Component")).toBeInTheDocument();
    expect(getByText("ProductFlairs Component")).toBeInTheDocument();
    expect(getByText("Specifications Component")).toBeInTheDocument();
    expect(getByText("AdditionalDetails Component")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = renderWithRedux(<SellingComponent />);
    expect(container).toMatchSnapshot();
  });
});
