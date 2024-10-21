import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import { SearchBar } from './searchbar';

describe('SearchBar component', () => {

  test('renders search input and search button', () => {
    render(<SearchBar />);
    
    const inputElement = screen.getByPlaceholderText(/Type here to search/i);
    const buttonElement = screen.getByRole('button');

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<SearchBar />);
    
    const inputElement = screen.getByPlaceholderText(/Type here to search/i);
    fireEvent.change(inputElement, { target: { value: 'test search' } });
    
    expect(inputElement).toHaveValue('test search');
  });

  test('submits search on button click', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<SearchBar />);
    
    const inputElement = screen.getByPlaceholderText(/Type here to search/i);
    const buttonElement = screen.getByRole('button');
    
    // Simulate typing in input
    fireEvent.change(inputElement, { target: { value: 'test search' } });
    
    // Simulate clicking the search button
    fireEvent.click(buttonElement);

    expect(consoleSpy).toHaveBeenCalledWith('Search submitted: ', 'test search');
    
    consoleSpy.mockRestore();
  });

});
