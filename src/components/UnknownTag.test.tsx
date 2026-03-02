import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnknownTag } from './UnknownTag';

describe('UnknownTag', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.warn to test warning behavior
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('renders placeholder with tag name', () => {
    render(<UnknownTag tagName="fakeTag" />);
    expect(screen.getByText(/fakeTag/)).toBeTruthy();
  });

  it('logs console.warn with tag name', () => {
    render(<UnknownTag tagName="testTag" />);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown tag: <testTag>');
  });

  it('shows debug info in development', () => {
    // Save original NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(<UnknownTag tagName="devTag" attributes={{ foo: 'bar', baz: 'qux' }} />);

    // Should show "Unknown tag:" label
    expect(screen.getByText(/Unknown tag:/)).toBeTruthy();
    // Should show tag name
    expect(screen.getByText(/devTag/)).toBeTruthy();
    // Should show attributes
    expect(screen.getByText(/Attributes:/)).toBeTruthy();
    expect(screen.getByText(/foo/)).toBeTruthy();

    // Restore NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it('shows minimal info in production', () => {
    // Save original NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(<UnknownTag tagName="prodTag" attributes={{ foo: 'bar' }} />);

    // Should show "Unknown:" label (not "Unknown tag:")
    expect(screen.getByText(/Unknown:/)).toBeTruthy();
    // Should show tag name
    expect(screen.getByText(/prodTag/)).toBeTruthy();
    // Should NOT show "Attributes:" debug info
    expect(screen.queryByText(/Attributes:/)).toBeFalsy();

    // Restore NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it('renders children inside placeholder', () => {
    render(
      <UnknownTag tagName="wrapper">
        <div>Child content</div>
      </UnknownTag>
    );
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('has error styling', () => {
    const { container } = render(<UnknownTag tagName="styled" />);
    const placeholder = container.firstChild as HTMLElement;

    // Check for error styling classes
    expect(placeholder.className).toContain('border-2');
    expect(placeholder.className).toContain('border-dashed');
    expect(placeholder.className).toContain('border-red-300');
    expect(placeholder.className).toContain('bg-red-50');
    expect(placeholder.className).toContain('p-2');
  });

  it('renders without attributes', () => {
    render(<UnknownTag tagName="noAttrs" />);
    expect(screen.getByText(/noAttrs/)).toBeTruthy();
    // Should not crash when attributes are undefined
    expect(screen.queryByText(/Attributes:/)).toBeFalsy();
  });

  it('renders with empty attributes object', () => {
    render(<UnknownTag tagName="emptyAttrs" attributes={{}} />);
    expect(screen.getByText(/emptyAttrs/)).toBeTruthy();
    // Should not show attributes section for empty object
    expect(screen.queryByText(/Attributes:/)).toBeFalsy();
  });

  it('logs warning on every render', () => {
    const { rerender } = render(<UnknownTag tagName="rerenderTest" />);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

    // Rerender and check warning is called again
    rerender(<UnknownTag tagName="rerenderTest" />);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
  });
});
