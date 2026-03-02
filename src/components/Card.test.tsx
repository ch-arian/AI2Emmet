import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('has default card styles', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');

    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('shadow-sm');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-slate-200');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('p-4');
  });

  it('merges user className with defaults', () => {
    render(<Card className="mt-4" data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');

    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('shadow-sm');
    expect(card).toHaveClass('mt-4');
  });

  it('passes through native div props', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick} id="test-card" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('id', 'test-card');

    card.click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('user classes override defaults', () => {
    render(
      <Card className="bg-blue-500 p-8" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');

    // tailwind-merge should make user classes win
    expect(card).toHaveClass('bg-blue-500');
    expect(card).toHaveClass('p-8');
    expect(card).not.toHaveClass('bg-white');
    expect(card).not.toHaveClass('p-4');
  });
});
