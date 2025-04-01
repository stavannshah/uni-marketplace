// src/components/ui/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional className when provided', () => {
    render(<Button className="test-class">Click Me</Button>);
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('test-class');
    expect(button).toHaveClass('bg-blue-500'); // Default class
  });
});