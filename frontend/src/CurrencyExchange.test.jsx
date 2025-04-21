// src/CurrencyExchange.test.jsx
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrencyExchangeListing from './CurrencyExchange';

// Mock fetch API
global.fetch = jest.fn();

describe('CurrencyExchangeListing Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    window.localStorage.getItem = jest.fn().mockReturnValue('test-user-id');
    
    // Mock successful API response for listings
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ listings: [
        {
          amount: 100,
          from_currency: "USD",
          to_currency: "EUR",
          request_date: new Date().toISOString()
        },
        {
          amount: 200,
          from_currency: "EUR",
          to_currency: "INR",
          request_date: new Date().toISOString()
        }
      ]})
    });
  });
  
  test('renders loading state initially', async () => {
    let rendered;
    
    // Wrap in act to handle state updates
    await act(async () => {
      rendered = render(<CurrencyExchangeListing />);
    });
    
    // Check for loading text in the container
    expect(rendered.container).toHaveTextContent('Loading...');
  });
  
  test('fetches exchange listings on mount', async () => {
    // Wrap in act to handle state updates
    await act(async () => {
      render(<CurrencyExchangeListing />);
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/getCurrencyExchangeListings')
    );
  });
  
  test('handles API errors', async () => {
    // Override the default mock to return an error
    global.fetch.mockRejectedValueOnce(new Error('Test error'));
    
    await act(async () => {
      render(<CurrencyExchangeListing />);
    });
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});