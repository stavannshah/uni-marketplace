// src/ItemListing.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react';
import ItemListing from './ItemListing';

// Mock fetch API
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

describe('ItemListing Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue('test-user-id'),
        setItem: jest.fn(),
      },
      writable: true
    });
    
    // Mock successful API response for listings
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listings: [
        {
          title: "Test Item",
          category: "Electronics",
          description: "This is a test item",
          price: 99.99,
          condition: "New",
          location: {
            city: "Gainesville",
            state: "FL",
            country: "USA"
          },
          date_posted: new Date().toISOString()
        }
      ]})
    });
  });
  
  test('displays item listings correctly', async () => {
    await act(async () => {
      render(<ItemListing />);
    });
    
    // Check that the "Create Listing" button is present
    expect(screen.getByText('Create Listing')).toBeInTheDocument();
    
    // Check that listing data is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('This is a test item')).toBeInTheDocument();
    expect(screen.getByText(/\$99.99/)).toBeInTheDocument();
  });
  
  test('opens the listing form dialog when Create Listing is clicked', async () => {
    // Mock the second fetch to return empty results
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listings: [
          {
            title: "Test Item",
            category: "Electronics",
            description: "This is a test item",
            price: 99.99,
            condition: "New",
            location: {
              city: "Gainesville",
              state: "FL",
              country: "USA"
            },
            date_posted: new Date().toISOString()
          }
        ]})
      });
    
    await act(async () => {
      render(<ItemListing />);
    });
    
    // Click the Create Listing button
    await act(async () => {
      fireEvent.click(screen.getByText('Create Listing'));
    });
    
    // Check if form dialog is displayed
    expect(screen.getByText('New Listing')).toBeInTheDocument();
  });
});