import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant styles when className includes "primary"', () => {
    render(<Button className="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies secondary variant styles when className includes "secondary"', () => {
    render(<Button className="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-slate-200');
    expect(button).toHaveClass('text-slate-800');
    expect(button).toHaveClass('hover:bg-slate-300');
  });

  it('applies danger variant styles when className includes "danger"', () => {
    render(<Button className="danger">Danger</Button>);
    const button = screen.getByText('Danger');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-red-700');
  });

  it('defaults to primary when no variant in className', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies sm size styles', () => {
    render(<Button className="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1.5');
    expect(button).toHaveClass('text-sm');
  });

  it('applies md size styles (default)', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByText('Medium');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('text-base');
  });

  it('applies lg size styles', () => {
    render(<Button className="lg">Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
  });

  it('combines variant and size from className', () => {
    render(<Button className="danger lg">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
  });

  it('merges user className with defaults', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-blue-600'); // Still has default variant
  });

  it('passes through native button props', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} type="submit" id="test-button">
        Click
      </Button>
    );
    const button = screen.getByText('Click');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'test-button');

    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled styles', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('user classes override defaults via tailwind-merge', () => {
    render(<Button className="bg-purple-600">Override</Button>);
    const button = screen.getByText('Override');
    // tailwind-merge should keep the last bg-* class
    expect(button).toHaveClass('bg-purple-600');
    expect(button).not.toHaveClass('bg-blue-600');
  });

  it('applies explicit variant prop', () => {
    render(<Button variant="danger">Explicit Variant</Button>);
    const button = screen.getByText('Explicit Variant');
    expect(button).toHaveClass('bg-red-600');
  });

  it('applies explicit size prop', () => {
    render(<Button size="lg">Explicit Size</Button>);
    const button = screen.getByText('Explicit Size');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
  });

  it('explicit props take precedence over className detection', () => {
    render(
      <Button variant="danger" size="lg" className="primary sm">
        Precedence
      </Button>
    );
    const button = screen.getByText('Precedence');
    expect(button).toHaveClass('bg-red-600'); // danger from prop
    expect(button).toHaveClass('px-6'); // lg from prop
    expect(button).not.toHaveClass('bg-blue-600'); // not primary
    expect(button).not.toHaveClass('px-3'); // not sm
  });

  it('applies base styles to all variants', () => {
    render(<Button>Base Styles</Button>);
    const button = screen.getByText('Base Styles');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('font-medium');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('transition-colors');
  });
});
