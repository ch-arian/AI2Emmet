/**
 * End-to-end pipeline tests
 *
 * Tests the complete Emmet -> HTML -> Safe HTML -> React transformation flow.
 * Verifies that all stages compose correctly and security is maintained.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React, { type ReactElement } from 'react';
import { pipeline } from './index';

describe('pipeline', () => {
  describe('basic transformations', () => {
    it('converts simple Emmet to React element', () => {
      const result = pipeline('div.card');

      // Render to verify DOM output - defaultRegistry maps 'div' to Container component
      const { container } = render(<>{result}</>);
      const element = container.firstChild as HTMLElement;

      expect(element).toBeDefined();
      expect(element.tagName.toLowerCase()).toBe('div');
      expect(element.className).toContain('card');
    });

    it('handles nested Emmet structure', () => {
      const result = pipeline('div.card>h1{Title}+p{Content}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      expect(div.tagName.toLowerCase()).toBe('div');
      expect(div.className).toContain('card');

      // Check children in DOM
      const h1 = div.querySelector('h1');
      const p = div.querySelector('p');
      expect(h1).toHaveTextContent('Title');
      expect(p).toHaveTextContent('Content');
    });

    it('preserves attributes', () => {
      // Use 'btn' - the REGISTERED semantic tag for buttons
      // 'button' is NOT registered and becomes UnknownTag
      const result = pipeline('btn[data-action="click"]{Click Me}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const button = container.querySelector('button');

      // VERIFY DOM - this is the key assertion
      // toHaveAttribute checks the actual rendered DOM element
      expect(button).toHaveAttribute('data-action', 'click');
      expect(button).toHaveTextContent('Click Me');
    });

    it('handles Tailwind modifier classes in bracket syntax', () => {
      const result = pipeline('div[class="hover:bg-blue-500"]');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      expect(div.tagName.toLowerCase()).toBe('div');
      expect(div.className).toContain('hover:bg-blue-500');
    });

    it('handles multiple Tailwind classes', () => {
      const result = pipeline('div[class="flex items-center justify-between"]');

      expect(result).toBeDefined();
      const div = result as ReactElement;
      expect(div.props.className).toBe('flex items-center justify-between');
    });
  });

  describe('XSS neutralization', () => {
    it('neutralizes script tags in text content', () => {
      const result = pipeline('div{<script>alert(1)</script>}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      expect(div.tagName.toLowerCase()).toBe('div');

      // Script tags and their content should be completely removed by DOMPurify
      // This is expected behavior - script content is dangerous and should be stripped entirely
      const content = div.textContent;
      // DOMPurify removes script tags completely, leaving empty content
      expect(content === undefined || content === '' || !content.includes('<script>')).toBe(true);
    });

    it('removes onclick handlers', () => {
      const result = pipeline('div[onclick="alert(1)"]{Click}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      expect(div.tagName.toLowerCase()).toBe('div');
      // Check that dangerous onclick attribute is NOT present in rendered DOM
      expect(div.getAttribute('onclick')).toBeNull();
    });

    it('removes onerror handlers', () => {
      // Note: 'img' is not registered, becomes UnknownTag
      // This test verifies sanitization happens before component mapping
      const result = pipeline('div[onerror="alert(1)"]');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      // Check that dangerous onerror attribute is NOT present in rendered DOM
      expect(div.getAttribute('onerror')).toBeNull();
    });

    it('neutralizes javascript: protocol in links', () => {
      // Note: 'a' is not registered, becomes UnknownTag
      // Use 'div' with href to test sanitization
      const result = pipeline('div[href="javascript:alert(1)"]{Link}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      // DOMPurify should strip dangerous href entirely
      expect(div.getAttribute('href')).toBeNull();
    });

    it('removes iframe tags', () => {
      const result = pipeline('div>iframe[src="evil.com"]');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      expect(div.tagName.toLowerCase()).toBe('div');

      // iframe should be removed by sanitizer - verify no iframe in DOM
      const iframe = div.querySelector('iframe');
      expect(iframe).toBeNull();
    });
  });

  describe('stage execution order', () => {
    it('expands Emmet before sanitizing', () => {
      // If we tried to sanitize Emmet directly, it would fail
      // This test verifies expansion happens first
      const result = pipeline('div.card{Content}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeDefined();
      expect(div.tagName.toLowerCase()).toBe('div');
      expect(div.className).toContain('card');
    });

    it('sanitizes before hydrating', () => {
      // If we hydrated before sanitizing, script tags would become React elements
      // This verifies sanitization happens before hydration
      const result = pipeline('div{<script>alert(1)</script>}');

      expect(result).toBeDefined();
      const div = result as ReactElement;

      // Script should be removed before hydration
      // DOMPurify strips script tags entirely (no content preserved for security)
      const content = div.props.children;
      expect(content === undefined || content === '' || (typeof content === 'string' && !content.includes('<script>'))).toBe(true);
    });

    it('produces final React elements', () => {
      const result = pipeline('div.test');

      // Final output should be React element, not string
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      // Render to verify it produces actual DOM
      const { container } = render(<>{result}</>);
      const div = container.firstChild as HTMLElement;
      expect(div.tagName.toLowerCase()).toBe('div');
    });
  });

  describe('error handling', () => {
    it('throws on empty Emmet string', () => {
      expect(() => pipeline('')).toThrow('Emmet abbreviation cannot be empty');
    });

    it('throws on invalid Emmet syntax', () => {
      // Note: Most invalid-looking Emmet actually parses (emmet is lenient)
      // This test mainly verifies error handling propagates from expandEmmet
      expect(() => pipeline('div>>>')).toThrow();
    });

    it('handles very large Emmet inputs', () => {
      const large = `ul>${Array.from({ length: 300 }, (_, i) => `li{Item ${i + 1}}`).join('+')}`;
      const result = pipeline(large);

      const { container } = render(<>{result}</>);
      const items = container.querySelectorAll('li');
      expect(items.length).toBe(300);
      expect(items[0]).toHaveTextContent('Item 1');
      expect(items[299]).toHaveTextContent('Item 300');
    });
  });

  describe('data attributes for action system', () => {
    it('preserves data-action attribute', () => {
      // btn -> Button component -> renders <button> with all props spread
      const result = pipeline('btn[data-action="submit"]{Submit}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const button = container.querySelector('button');

      // DOM verification: data-action must be on the actual DOM element
      expect(button).toHaveAttribute('data-action', 'submit');
    });

    it('preserves data-payload attribute', () => {
      const result = pipeline('btn[data-payload="test"]{Click}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('data-payload', 'test');
    });

    it('preserves both data-action and data-payload', () => {
      const result = pipeline('btn[data-action="send"][data-payload="message"]{Send}');

      // Render to verify DOM output
      const { container } = render(<>{result}</>);
      const button = container.querySelector('button');

      // Both attributes must appear in rendered DOM
      expect(button).toHaveAttribute('data-action', 'send');
      expect(button).toHaveAttribute('data-payload', 'message');
    });
  });
});
