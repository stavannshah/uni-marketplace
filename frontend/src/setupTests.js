// src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Increase timeout for async tests to prevent flakiness
configure({ asyncUtilTimeout: 5000 });

// Configure console to filter act() warnings during tests
const originalError = console.error;
console.error = (...args) => {
  // Filter out react act() warnings for async operations 
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning: An update to')) {
    return;
  }
  originalError(...args);
};

// Mock window's localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock emailjs
jest.mock('emailjs-com', () => ({
  send: jest.fn().mockResolvedValue('OK')
}));

// Mock fetch API with immediate resolution for tests
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  });
});

// Mock window.alert
global.alert = jest.fn();

// Define import.meta.env for Vite environment variables
global.import = { 
  meta: { 
    env: {
      VITE_EMAIL_SERVICE_ID: 'test-service-id',
      VITE_EMAIL_TEMPLATE_ID: 'test-template-id',
      VITE_EMAIL_USER_ID: 'test-user-id'
    } 
  } 
};
