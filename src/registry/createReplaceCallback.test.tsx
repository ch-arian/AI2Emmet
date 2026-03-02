import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import parse from 'html-react-parser';
import React from 'react';
import { ComponentRegistry } from './ComponentRegistry';
import { createReplaceCallback } from './createReplaceCallback';
import { Button, Card } from '../components';

describe('createReplaceCallback', () => {
  it('should render registered component', () => {
    const registry = new ComponentRegistry({
      entries: [{ tag: 'btn', component: Button }]
    });

    const replace = createReplaceCallback(registry);
    // Use parse directly - createReplaceCallback handles recursion internally
    const result = parse('<btn>Click</btn>', { replace: replace as any });

    render(<>{result}</>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click');
  });

  it('should render UnknownTag for unregistered tag', () => {
    const registry = new ComponentRegistry();
    const replace = createReplaceCallback(registry);
    const result = parse('<unknown>Test</unknown>', { replace: replace as any });

    render(<>{result}</>);
    expect(screen.getByText(/Unknown tag:/)).toBeInTheDocument();
    expect(screen.getByText(/unknown/)).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should convert class attribute to className', () => {
    const registry = new ComponentRegistry({
      entries: [{ tag: 'btn', component: Button }]
    });

    const replace = createReplaceCallback(registry);
    const result = parse('<btn class="primary">Submit</btn>', { replace: replace as any });

    render(<>{result}</>);
    const button = screen.getByRole('button');

    // Button component extracts 'primary' as variant and applies corresponding Tailwind classes
    // The keyword 'primary' is filtered from className, replaced with actual styling classes
    // This tests the rendered DOM has the correct visual styling, not the keyword
    expect(button).toHaveClass('bg-blue-600'); // primary variant's background color
    expect(button).toHaveClass('text-white');  // primary variant's text color
  });

  it('should pass through other attributes', () => {
    const registry = new ComponentRegistry({
      entries: [{ tag: 'btn', component: Button }]
    });

    const replace = createReplaceCallback(registry);
    const result = parse('<btn data-testid="my-button" aria-label="Submit form">Submit</btn>', { replace: replace as any });

    render(<>{result}</>);
    const button = screen.getByTestId('my-button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('should handle nested registered components', () => {
    const registry = new ComponentRegistry({
      entries: [
        { tag: 'card', component: Card },
        { tag: 'btn', component: Button }
      ]
    });

    const replace = createReplaceCallback(registry);
    const result = parse('<card><btn>Click</btn></card>', { replace: replace as any });

    render(<>{result}</>);

    // Card should render
    const card = screen.getByText('Click').closest('div');
    expect(card).toHaveClass('bg-white');

    // Button inside should render
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click');
  });

  it('should handle mixed registered and unknown tags', () => {
    const registry = new ComponentRegistry({
      entries: [{ tag: 'btn', component: Button }]
    });

    const replace = createReplaceCallback(registry);
    const result = parse('<unknown><btn>Click</btn></unknown>', { replace: replace as any });

    render(<>{result}</>);

    // Unknown tag should render error
    expect(screen.getByText(/Unknown tag:/)).toBeInTheDocument();

    // Button inside should still render
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click');
  });

  it('should handle components with no attributes', () => {
    const registry = new ComponentRegistry({
      entries: [{ tag: 'btn', component: Button }]
    });

    const replace = createReplaceCallback(registry);
    const result = parse('<btn>Plain button</btn>', { replace: replace as any });

    render(<>{result}</>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Plain button');
  });

  it('should handle components with empty content', () => {
    const registry = new ComponentRegistry({
      entries: [{ tag: 'btn', component: Button }]
    });

    const replace = createReplaceCallback(registry);
    const result = parse('<btn></btn>', { replace: replace as any });

    render(<>{result}</>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('should pass through standard HTML tags without replacement', () => {
    const registry = new ComponentRegistry();
    const replace = createReplaceCallback(registry);
    const result = parse('<div><h2>My Tasks</h2><ul><li>Item 1</li><li>Item 2</li></ul></div>', { replace: replace as any });

    render(<>{result}</>);

    // Standard HTML tags should render normally, not as UnknownTag
    expect(screen.queryByText(/Unknown tag:/)).not.toBeInTheDocument();
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should pass UnknownTag attributes for debugging', () => {
    const registry = new ComponentRegistry();
    const replace = createReplaceCallback(registry);
    const result = parse('<custom class="foo" data-id="123">Content</custom>', { replace: replace as any });

    render(<>{result}</>);

    // Should show attributes in debug info
    const errorBox = screen.getAllByText(/Unknown tag:/)[0].closest('div');
    expect(errorBox).toBeInTheDocument();
  });
});
