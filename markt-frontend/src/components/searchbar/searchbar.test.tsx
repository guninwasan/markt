import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import { SearchBar } from "./searchbar";

// Explicitly type fetch as jest.Mock
(global.fetch as jest.Mock) = jest.fn();

describe("SearchBar Component", () => {
  beforeEach(() => {
    // Clear any mock calls before each test
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    // Clean up mocks and timers after each test
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test("renders search input and button", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("updates input value on typing", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Test" } });
    expect(input).toHaveValue("Test");
  });

  test("does not fetch suggestions if input is empty", async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "" } });
    expect(fetch).not.toHaveBeenCalled();
  });

  test("displays error message if API request fails", async () => {
    console.error = jest.fn(); // Suppress error log in test output
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "Test" } });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error fetching suggestions:", expect.any(Error));
      expect(screen.queryByText("Test Item 1")).not.toBeInTheDocument();
    });
  });

  test("displays suggestions with highlighted search term", async () => {
    const mockData = { status: 1000, data: [{ title: "Test Item 1", id: 1 }] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "Test" } });

    await waitFor(() => {
      const highlighted = screen.getByText("Test");
      expect(highlighted.tagName).toBe("STRONG");
      expect(highlighted).toHaveStyle("font-weight: bold");
    });
  });

  test("triggers search submission on button click", () => {
    console.log = jest.fn();
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Submit Test" } });

    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith("Search submitted:", "Submit Test");
  });
});
