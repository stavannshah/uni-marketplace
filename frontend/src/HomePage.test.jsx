// src/HomePage.test.jsx
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserActivitiesSection from './HomePage';

// Mock fetch API
global.fetch = jest.fn();

// Mock console.log to suppress logs
console.log = jest.fn();

describe('UserActivitiesSection Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    window.localStorage.getItem = jest.fn().mockReturnValue('test-user-id');
    
    // Mock API response for user activities
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ 
        marketplace_listings: [
          {
            id: '1',
            title: "Laptop for sale",
            price: 500,
            condition: "Like New",
            category: "Electronics",
            description: "MacBook Pro 2023 model"
          }
        ],
        currency_exchange_requests: [],
        subleasing_requests: []
      })
    });
  });
  
  test('renders loading state initially', async () => {
    // Wrap in act to handle state updates
    await act(async () => {
      render(<UserActivitiesSection />);
    });
    
    // Check for loading spinner (if still visible) or content loaded
    expect(screen.queryByRole('progressbar') || screen.getByText(/Active Item Listings/)).toBeInTheDocument();
  });
  
  test('fetches user ID from localStorage', async () => {
    // Wrap in act to handle state updates
    await act(async () => {
      render(<UserActivitiesSection />);
    });
    
    // Check localStorage.getItem was called
    expect(window.localStorage.getItem).toHaveBeenCalledWith('userID');
  });
  
  test('makes API call to fetch user activities', async () => {
    // Wrap in act to handle state updates
    await act(async () => {
      render(<UserActivitiesSection />);
    });
    
    // Check fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/activities')
    );
  });
});