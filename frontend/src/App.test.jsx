import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { act } from 'react-dom/test-utils';

// Mock localStorage
const mockLocalStorage = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Mock emailjs
jest.mock('emailjs-com', () => ({
  send: jest.fn().mockResolvedValue('OK')
}));

// Mock fetch API
global.fetch = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('OTP Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null); // Not logged in by default
    global.alert = jest.fn();
  });

  test('renders login form by default', () => {
    render(<App />);
    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(<App />);
    
    const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    
    const sendButton = screen.getByText(/Send OTP/i);
    fireEvent.click(sendButton);
    
    expect(screen.getByText(/Please enter a valid @ufl.edu email address/i)).toBeInTheDocument();
  });

  test('shows OTP verification after sending OTP', async () => {
    render(<App />);
    
    const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
    fireEvent.change(emailInput, { target: { value: 'test@ufl.edu' } });
    
    const sendButton = screen.getByText(/Send OTP/i);
    await act(async () => {
      fireEvent.click(sendButton);
    });
    
    expect(global.alert).toHaveBeenCalledWith('OTP sent to your email!');
    expect(screen.getByText(/Verify OTP/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    // Mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' })
    });
    
    render(<App />);
    
    // Enter email and send OTP
    const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
    fireEvent.change(emailInput, { target: { value: 'test@ufl.edu' } });
    
    await act(async () => {
      fireEvent.click(screen.getByText(/Send OTP/i));
    });
    
    // Enter OTP
    const otpInput = screen.getByLabelText(/Enter the OTP/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });
    
    // Click verify and check localStorage was set
    await act(async () => {
      fireEvent.click(screen.getByText(/Verify and Login/i));
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
  });
});

describe('MainWebsite Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('true'); // Logged in
    
    // Mock fetch for users list
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        users: [
          { email: 'user1@ufl.edu', last_login: '2025-03-01T12:00:00Z' },
          { email: 'user2@ufl.edu', last_login: '2025-03-02T14:30:00Z' }
        ]
      })
    });
  });

  test('renders main website when logged in', async () => {
    render(<App />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('can switch between tabs', async () => {
    render(<App />);
    
    // Click on different tabs
    fireEvent.click(screen.getByText(/Item Listing/i));
    expect(screen.getByText(/Welcome to the Item Listing page!/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/Currency Exchange Listing/i));
    expect(screen.getByText(/Welcome to the Currency Exchange Listing page!/i)).toBeInTheDocument();
  });

  test('can log out', async () => {
    render(<App />);
    
    // Mock window.location.reload
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };
    
    // Click logout
    fireEvent.click(screen.getByText(/Logout/i));
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
    expect(window.location.reload).toHaveBeenCalled();
    
    // Restore window.location
    window.location = originalLocation;
  });
});