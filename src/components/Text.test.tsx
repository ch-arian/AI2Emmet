import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading, Paragraph, Span } from './Text';

describe('Heading', () => {
  it('renders children', () => {
    render(<Heading>Test Heading</Heading>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Test Heading');
  });

  it('has correct default styles', () => {
    render(<Heading>Styled Heading</Heading>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.className).toContain('text-2xl');
    expect(heading.className).toContain('font-semibold');
    expect(heading.className).toContain('text-slate-900');
    expect(heading.className).toContain('mb-2');
  });

  it('merges user className', () => {
    render(<Heading className="text-4xl text-blue-600">Custom Heading</Heading>);
    const heading = screen.getByRole('heading', { level: 1 });
    // User classes override defaults via tailwind-merge
    expect(heading.className).toContain('text-4xl');
    expect(heading.className).toContain('text-blue-600');
    expect(heading.className).toContain('font-semibold');
    expect(heading.className).toContain('mb-2');
  });

  it('renders correct element type', () => {
    render(<Heading>Element Test</Heading>);
    expect(screen.getByRole('heading', { level: 1 }).tagName).toBe('H1');
  });

  it('passes through native props', () => {
    render(<Heading id="test-heading" data-testid="custom">Props Test</Heading>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.id).toBe('test-heading');
    expect(heading.getAttribute('data-testid')).toBe('custom');
  });
});

describe('Paragraph', () => {
  it('renders children', () => {
    render(<Paragraph>Test paragraph content.</Paragraph>);
    const paragraph = screen.getByText('Test paragraph content.');
    expect(paragraph).toBeTruthy();
  });

  it('has correct default styles', () => {
    render(<Paragraph>Styled paragraph</Paragraph>);
    const paragraph = screen.getByText('Styled paragraph');
    expect(paragraph.className).toContain('text-base');
    expect(paragraph.className).toContain('text-slate-700');
    expect(paragraph.className).toContain('leading-relaxed');
    expect(paragraph.className).toContain('mb-4');
  });

  it('merges user className', () => {
    render(<Paragraph className="text-lg text-gray-800">Custom paragraph</Paragraph>);
    const paragraph = screen.getByText('Custom paragraph');
    // User classes override defaults via tailwind-merge
    // text-lg overrides text-base (and includes its own line-height)
    // text-gray-800 overrides text-slate-700
    expect(paragraph.className).toContain('text-lg');
    expect(paragraph.className).toContain('text-gray-800');
    expect(paragraph.className).toContain('mb-4');
    // leading-relaxed is removed because text-lg has its own line-height
  });

  it('renders correct element type', () => {
    render(<Paragraph>Element Test</Paragraph>);
    expect(screen.getByText('Element Test').tagName).toBe('P');
  });

  it('passes through native props', () => {
    render(<Paragraph id="test-p" data-testid="custom">Props Test</Paragraph>);
    const paragraph = screen.getByText('Props Test');
    expect(paragraph.id).toBe('test-p');
    expect(paragraph.getAttribute('data-testid')).toBe('custom');
  });
});

describe('Span', () => {
  it('renders children', () => {
    render(<Span>Test span content</Span>);
    const span = screen.getByText('Test span content');
    expect(span).toBeTruthy();
  });

  it('has no default styles', () => {
    render(<Span>Plain span</Span>);
    const span = screen.getByText('Plain span');
    // Span should have no default styling - only user className
    // twMerge with no defaults just returns the className or empty string
    expect(span.className).toBe('');
  });

  it('applies user className', () => {
    render(<Span className="font-bold text-red-500">Styled span</Span>);
    const span = screen.getByText('Styled span');
    expect(span.className).toContain('font-bold');
    expect(span.className).toContain('text-red-500');
  });

  it('renders correct element type', () => {
    render(<Span>Element Test</Span>);
    expect(screen.getByText('Element Test').tagName).toBe('SPAN');
  });

  it('passes through native props', () => {
    render(<Span id="test-span" data-testid="custom">Props Test</Span>);
    const span = screen.getByText('Props Test');
    expect(span.id).toBe('test-span');
    expect(span.getAttribute('data-testid')).toBe('custom');
  });
});
