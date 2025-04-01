import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock components to simplify testing
jest.mock('./ItemListing', () => () => <div data-testid="item-listing">Item Listing Component</div>);

// Mock emailjs
jest.mock('emailjs-com', () => ({
  send: jest.fn().mockResolvedValue('OK')
}));

// Mock fetch
global.fetch = jest.fn();

describe('App Component', () => {
  let mockLocalStorage;
  
  beforeEach(() => {
    // Setup mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    // Mock window.alert
    global.alert = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });
  
  test('renders login page when not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(<App />);
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText('Send OTP')).toBeInTheDocument();
  });
  
  test('renders main website when logged in', () => {
    mockLocalStorage.getItem.mockReturnValue('true');
    
    // Mock API responses
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        users: [],
        user_count: 0
      })
    });
    
    render(<App />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  
  test('validates email format', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(<App />);
    
    const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid@gmail.com' } });
    
    fireEvent.click(screen.getByText('Send OTP'));
    
    expect(screen.getByText('Please enter a valid @ufl.edu email address.')).toBeInTheDocument();
  });
  
  test('sends OTP for valid email', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(<App />);
    
    const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
    fireEvent.change(emailInput, { target: { value: 'test@ufl.edu' } });
    
    fireEvent.click(screen.getByText('Send OTP'));
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('OTP sent to your email!');
    });
    
    expect(screen.getByText('Verify OTP')).toBeInTheDocument();
  });
  
  test('completes login flow with correct OTP', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Mock successful user save API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User saved successfully', userID: 'test-user-id' })
    });
    
    render(<App />);
    
    // Enter email
    const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
    fireEvent.change(emailInput, { target: { value: 'test@ufl.edu' } });
    
    // Send OTP
    fireEvent.click(screen.getByText('Send OTP'));
    
    await waitFor(() => {
      expect(screen.getByText('Verify OTP')).toBeInTheDocument();
    });
    
    // Get generated OTP from internal state (this is a bit hacky but necessary for testing)
    const generatedOtp = jest.requireMock('emailjs-com').send.mock.calls[0][2].otp;
    
    // Enter OTP
    const otpInput = screen.getByLabelText(/Enter the OTP/i);
    fireEvent.change(otpInput, { target: { value: generatedOtp } });
    
    // Verify OTP
    fireEvent.click(screen.getByText('Verify and Login'));
    
    // Check if localStorage was set
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
    });
  });
  
  test('switches tabs correctly', async () => {
    mockLocalStorage.getItem.mockReturnValue('true');
    
    // Mock API responses
    global.fetch.mockResolvedValue({
      json: async () => ({
        users: [],
        user_count: 0
      })
    });
    
    render(<App />);
    
    // Click on Item Listing tab
    fireEvent.click(screen.getByText('Item Listing'));
    
    expect(screen.getByTestId('item-listing')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the Item Listing page!/i)).toBeInTheDocument();
    
    // Click on Currency Exchange tab
    fireEvent.click(screen.getByText('Currency Exchange Listing'));
    
    expect(screen.getByText(/Welcome to the Currency Exchange Listing page!/i)).toBeInTheDocument();
  });
  
  test('logs out correctly', async () => {
    mockLocalStorage.getItem.mockReturnValue('true');
    
    // Mock window.location.reload
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };
    
    // Mock API responses
    global.fetch.mockResolvedValue({
      json: async () => ({
        users: [],
        user_count: 0
      })
    });
    
    render(<App />);
    
    // Click logout
    fireEvent.click(screen.getByText('Logout'));
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
    expect(window.location.reload).toHaveBeenCalled();
    
    // Restore window.location
    window.location = originalLocation;
  });
});

// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import App from './App';
// import { act } from 'react-dom/test-utils';

// // Mock localStorage
// const mockLocalStorage = (function() {
//   let store = {};
//   return {
//     getItem: jest.fn(key => store[key] || null),
//     setItem: jest.fn((key, value) => {
//       store[key] = value.toString();
//     }),
//     removeItem: jest.fn(key => {
//       delete store[key];
//     }),
//     clear: jest.fn(() => {
//       store = {};
//     })
//   };
// })();

// // Mock emailjs
// jest.mock('emailjs-com', () => ({
//   send: jest.fn().mockResolvedValue('OK')
// }));

// // Mock fetch API
// global.fetch = jest.fn();

// Object.defineProperty(window, 'localStorage', {
//   value: mockLocalStorage
// });

// describe('OTP Login Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockLocalStorage.getItem.mockReturnValue(null); // Not logged in by default
//     global.alert = jest.fn();
//   });

//   test('renders login form by default', () => {
//     render(<App />);
//     expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
//   });

//   test('validates email format', async () => {
//     render(<App />);
    
//     const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
//     fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    
//     const sendButton = screen.getByText(/Send OTP/i);
//     fireEvent.click(sendButton);
    
//     expect(screen.getByText(/Please enter a valid @ufl.edu email address/i)).toBeInTheDocument();
//   });

//   test('shows OTP verification after sending OTP', async () => {
//     render(<App />);
    
//     const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
//     fireEvent.change(emailInput, { target: { value: 'test@ufl.edu' } });
    
//     const sendButton = screen.getByText(/Send OTP/i);
//     await act(async () => {
//       fireEvent.click(sendButton);
//     });
    
//     expect(global.alert).toHaveBeenCalledWith('OTP sent to your email!');
//     expect(screen.getByText(/Verify OTP/i)).toBeInTheDocument();
//   });

//   test('handles successful login', async () => {
//     // Mock fetch to return success
//     global.fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({ message: 'Success' })
//     });
    
//     render(<App />);
    
//     // Enter email and send OTP
//     const emailInput = screen.getByLabelText(/Enter your @ufl.edu email/i);
//     fireEvent.change(emailInput, { target: { value: 'test@ufl.edu' } });
    
//     await act(async () => {
//       fireEvent.click(screen.getByText(/Send OTP/i));
//     });
    
//     // Enter OTP
//     const otpInput = screen.getByLabelText(/Enter the OTP/i);
//     fireEvent.change(otpInput, { target: { value: '123456' } });
    
//     // Click verify and check localStorage was set
//     await act(async () => {
//       fireEvent.click(screen.getByText(/Verify and Login/i));
//     });
    
//     expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
//   });
// });

// describe('MainWebsite Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockLocalStorage.getItem.mockReturnValue('true'); // Logged in
    
//     // Mock fetch for users list
//     global.fetch.mockResolvedValueOnce({
//       json: async () => ({
//         users: [
//           { email: 'user1@ufl.edu', last_login: '2025-03-01T12:00:00Z' },
//           { email: 'user2@ufl.edu', last_login: '2025-03-02T14:30:00Z' }
//         ]
//       })
//     });
//   });

//   test('renders main website when logged in', async () => {
//     render(<App />);
//     expect(screen.getByText(/Home/i)).toBeInTheDocument();
//   });

//   test('can switch between tabs', async () => {
//     render(<App />);
    
//     // Click on different tabs
//     fireEvent.click(screen.getByText(/Item Listing/i));
//     expect(screen.getByText(/Welcome to the Item Listing page!/i)).toBeInTheDocument();
    
//     fireEvent.click(screen.getByText(/Currency Exchange Listing/i));
//     expect(screen.getByText(/Welcome to the Currency Exchange Listing page!/i)).toBeInTheDocument();
//   });

//   test('can log out', async () => {
//     render(<App />);
    
//     // Mock window.location.reload
//     const originalLocation = window.location;
//     delete window.location;
//     window.location = { reload: jest.fn() };
    
//     // Click logout
//     fireEvent.click(screen.getByText(/Logout/i));
    
//     expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
//     expect(window.location.reload).toHaveBeenCalled();
    
//     // Restore window.location
//     window.location = originalLocation;
//   });
// });