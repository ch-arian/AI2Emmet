import { describe, it, expect, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { useRef, type ReactNode } from 'react';
import { useActionHandler } from './useActionHandler';
import type { ActionHandler } from '../types/actions';

// Test helper component
function TestContainer({ onAction, children }: { onAction: ActionHandler; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useActionHandler(rootRef, onAction);
  return <div ref={rootRef}>{children}</div>;
}

describe('useActionHandler', () => {
  it('calls onAction when data-action element clicked', () => {
    const onAction = vi.fn();
    const { container } = render(
      <TestContainer onAction={onAction}>
        <button data-action="submit">Submit</button>
      </TestContainer>
    );

    const button = container.querySelector('[data-action="submit"]') as HTMLButtonElement;
    button.click();

    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction).toHaveBeenCalledWith(
      'submit',
      undefined,
      expect.any(MouseEvent)
    );
  });

  it('parses and passes JSON payload', () => {
    const onAction = vi.fn();
    const { container } = render(
      <TestContainer onAction={onAction}>
        <button data-action="submit" data-payload='{"id":42}'>Submit</button>
      </TestContainer>
    );

    const button = container.querySelector('[data-action="submit"]') as HTMLButtonElement;
    button.click();

    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction).toHaveBeenCalledWith(
      'submit',
      { id: 42 },
      expect.any(MouseEvent)
    );
  });

  it('passes Error for invalid JSON payload', () => {
    const onAction = vi.fn();
    const { container } = render(
      <TestContainer onAction={onAction}>
        <button data-action="submit" data-payload="invalid json">Submit</button>
      </TestContainer>
    );

    const button = container.querySelector('[data-action="submit"]') as HTMLButtonElement;
    button.click();

    expect(onAction).toHaveBeenCalledOnce();
    const [, payload] = onAction.mock.calls[0];
    expect(payload).toBeInstanceOf(Error);
  });

  it('does not fire for elements without data-action', () => {
    const onAction = vi.fn();
    const { container } = render(
      <TestContainer onAction={onAction}>
        <button>Plain Button</button>
      </TestContainer>
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(onAction).not.toHaveBeenCalled();
  });

  it('bubbles to nested data-action elements', () => {
    const onAction = vi.fn();
    const { container } = render(
      <TestContainer onAction={onAction}>
        <div data-action="outer">
          <button data-action="inner">Inner Button</button>
        </div>
      </TestContainer>
    );

    const button = container.querySelector('[data-action="inner"]') as HTMLButtonElement;
    button.click();

    // Should be called twice: once for inner, once for outer (bubbling)
    expect(onAction).toHaveBeenCalledTimes(2);

    // First call should be for inner button
    expect(onAction.mock.calls[0][0]).toBe('inner');

    // Second call should be for outer div
    expect(onAction.mock.calls[1][0]).toBe('outer');
  });

  it('cleans up listener on unmount', () => {
    const onAction = vi.fn();
    const { unmount, container } = render(
      <TestContainer onAction={onAction}>
        <button data-action="submit">Submit</button>
      </TestContainer>
    );

    // Unmount component
    unmount();

    // Try to click (should not call onAction after unmount)
    const button = container.querySelector('[data-action="submit"]') as HTMLButtonElement;
    if (button) {
      button.click();
    }

    expect(onAction).not.toHaveBeenCalled();
  });

  it('finds action on parent when clicking nested element', () => {
    const onAction = vi.fn();
    const { container } = render(
      <TestContainer onAction={onAction}>
        <button data-action="submit">
          <span>Click Me</span>
        </button>
      </TestContainer>
    );

    const span = container.querySelector('span') as HTMLSpanElement;
    span.click();

    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction).toHaveBeenCalledWith(
      'submit',
      undefined,
      expect.any(MouseEvent)
    );
  });

  it('uses latest onAction callback without recreating listener', () => {
    let callCount = 0;
    const firstHandler = vi.fn(() => callCount++);
    const secondHandler = vi.fn(() => callCount++);

    const { container, rerender } = render(
      <TestContainer onAction={firstHandler}>
        <button data-action="submit">Submit</button>
      </TestContainer>
    );

    const button = container.querySelector('[data-action="submit"]') as HTMLButtonElement;
    button.click();

    expect(firstHandler).toHaveBeenCalledOnce();
    expect(secondHandler).not.toHaveBeenCalled();
    expect(callCount).toBe(1);

    // Re-render with new callback
    rerender(
      <TestContainer onAction={secondHandler}>
        <button data-action="submit">Submit</button>
      </TestContainer>
    );

    button.click();

    expect(firstHandler).toHaveBeenCalledOnce(); // Still only once
    expect(secondHandler).toHaveBeenCalledOnce(); // New handler called
    expect(callCount).toBe(2);
  });
});
