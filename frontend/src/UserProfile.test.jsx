// src/UserProfile.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfilePopup from './components/UserProfilePopup';

// Mock API
global.fetch = jest.fn();
global.alert = jest.fn();

describe('UserProfile Component', () => {
  const mockHandleClose = jest.fn();
  const mockSaveProfile = jest.fn();
  const mockProfile = {
    name: "Test User",
    email: "test@ufl.edu",
    preferred_email: "test.preferred@gmail.com",
    preferences: "Books, Electronics",
    location: "Gainesville, FL"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders nothing when closed', () => {
    const { container } = render(
      <UserProfilePopup 
        open={false}
        handleClose={mockHandleClose}
        saveProfile={mockSaveProfile}
        profile={mockProfile}
      />
    );
    
    expect(container).toBeEmptyDOMElement();
  });
  
  test('renders profile form when open', () => {
    render(
      <UserProfilePopup 
        open={true}
        handleClose={mockHandleClose}
        saveProfile={mockSaveProfile}
        profile={mockProfile}
      />
    );
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toHaveValue('Test User');
    expect(screen.getByLabelText(/Preferred Email/)).toHaveValue('test.preferred@gmail.com');
    expect(screen.getByLabelText(/Email \(for login\)/)).toBeDisabled();
  });
  
  test('calls handleClose when Cancel is clicked', () => {
    render(
      <UserProfilePopup 
        open={true}
        handleClose={mockHandleClose}
        saveProfile={mockSaveProfile}
        profile={mockProfile}
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
  
  test('updates form values on change', () => {
    render(
      <UserProfilePopup 
        open={true}
        handleClose={mockHandleClose}
        saveProfile={mockSaveProfile}
        profile={mockProfile}
      />
    );
    
    const nameInput = screen.getByLabelText(/Name/);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    expect(nameInput).toHaveValue('Updated Name');
  });
  
  test('calls saveProfile with updated data when Save is clicked', () => {
    render(
      <UserProfilePopup 
        open={true}
        handleClose={mockHandleClose}
        saveProfile={mockSaveProfile}
        profile={mockProfile}
      />
    );
    
    // Change a field
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Updated Name' } });
    
    // Click save
    fireEvent.click(screen.getByText('Save'));
    
    // Check if saveProfile was called with updated data
    expect(mockSaveProfile).toHaveBeenCalledTimes(1);
    expect(mockSaveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Updated Name',
        email: 'test@ufl.edu'
      })
    );
    
    // Check if handleClose was called
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});