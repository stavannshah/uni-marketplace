// src/SubLeasing.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubLeasingListing from './SubLeasing';

// Mock fetch API
global.fetch = jest.fn();

describe('SubLeasingListing Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    window.localStorage.getItem = jest.fn().mockReturnValue('test-user-id');
    
    // Mock successful API response for listings
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ 
        requests: [
          {
            title: "Apartment near campus",
            description: "Spacious 1BR apartment",
            rent: 800,
            location: {
              city: "Gainesville",
              state: "FL",
              country: "USA"
            },
            period: {
              start_date: "2025-06-01T00:00:00.000Z",
              end_date: "2025-08-31T00:00:00.000Z"
            },
            date_posted: new Date().toISOString()
          }
        ]
      })
    });
  });
  
  test('renders loading state initially', () => {
    render(<SubLeasingListing />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('fetches sublease listings on mount', () => {
    render(<SubLeasingListing />);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/getSubleasingRequests')
    );
  });
  
  test('handles API errors', async () => {
    // Override the default mock to return an error
    global.fetch.mockRejectedValueOnce(new Error('API error'));
    
    render(<SubLeasingListing />);
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    
    // Check that some error message is displayed (without specifying the exact wording)
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load listings/)).toBeInTheDocument();
  });
});