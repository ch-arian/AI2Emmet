import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Test content</Container>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies user className', () => {
    render(
      <Container className="flex flex-col gap-4" data-testid="container">
        Content
      </Container>
    );
    const container = screen.getByTestId('container');

    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('gap-4');
  });

  it('passes through native div props', () => {
    const handleClick = vi.fn();
    render(
      <Container onClick={handleClick} id="test-container" data-testid="container">
        Content
      </Container>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('id', 'test-container');

    container.click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('multiple containers can be nested', () => {
    render(
      <Container data-testid="outer">
        <Container data-testid="inner">
          Nested content
        </Container>
      </Container>
    );

    const outer = screen.getByTestId('outer');
    const inner = screen.getByTestId('inner');

    expect(outer).toBeInTheDocument();
    expect(inner).toBeInTheDocument();
    expect(outer).toContainElement(inner);
    expect(screen.getByText('Nested content')).toBeInTheDocument();
  });
});
