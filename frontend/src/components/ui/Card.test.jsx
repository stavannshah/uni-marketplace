// src/components/ui/Card.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(<Card><p>Test Content</p></Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies additional className when provided', () => {
    render(<Card className="test-class"><p>Test Content</p></Card>);
    const card = screen.getByText('Test Content').closest('div');
    expect(card).toHaveClass('test-class');
    expect(card).toHaveClass('bg-white'); // Default class
  });
});