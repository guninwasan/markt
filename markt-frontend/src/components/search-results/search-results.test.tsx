import { render, screen } from '@testing-library/react';
import { SearchResults } from './search-results';
import { useSearchParams } from 'react-router-dom';

// Mock the useSearchParams hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep the original imports from react-router-dom
  useSearchParams: jest.fn(), // Mock useSearchParams
}));

describe('SearchResults Component', () => {
  it('renders the component and shows loading state initially', () => {
    // TypeScript needs us to cast the mock correctly
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('keywords=test')]);

    render(<SearchResults />);

    // Check if "Loading..." text is in the document when the component is first rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
