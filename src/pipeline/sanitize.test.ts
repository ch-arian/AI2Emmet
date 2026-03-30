/**
 * HTML Sanitization Test Suite
 *
 * Tests DOMPurify-based sanitization with strict allowlist configuration.
 * Security focus: Ensure XSS vectors are removed while preserving safe content.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from './sanitize';

describe('sanitizeHTML', () => {
  describe('safe content preservation', () => {
    it('should preserve safe HTML unchanged', () => {
      const input = '<div>Hello</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div>Hello</div>');
    });

    it('should preserve allowed attributes', () => {
      const input = '<div class="card">Text</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div class="card">Text</div>');
    });

    it('should preserve multiple allowed tags and attributes', () => {
      const input = '<div class="container"><h2 id="subtitle">Hello</h2><p class="text">World</p></div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div class="container"><h2 id="subtitle">Hello</h2><p class="text">World</p></div>');
    });
  });

  describe('XSS vector removal', () => {
    it('should remove script tags completely', () => {
      const input = '<script>alert("xss")</script>';
      const output = sanitizeHTML(input);
      expect(output).toBe('');
      expect(output).not.toContain('script');
    });

    it('should remove script tags but preserve surrounding content', () => {
      const input = '<div><script>bad</script>good</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div>good</div>');
      expect(output).not.toContain('script');
      expect(output).not.toContain('bad');
    });

    it('should remove onclick event handlers', () => {
      const input = '<div onclick="alert(1)">Click</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div>Click</div>');
      expect(output).not.toContain('onclick');
    });

    it('should remove onmouseover event handlers', () => {
      const input = '<div onmouseover="x">Text</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div>Text</div>');
      expect(output).not.toContain('onmouseover');
    });

    it('should remove onerror event handlers from images', () => {
      const input = '<img src="x" onerror="alert(1)">';
      const output = sanitizeHTML(input);
      expect(output).toBe('<img src="x">');
      expect(output).not.toContain('onerror');
    });

    it('should remove onload event handlers', () => {
      const input = '<img src="x" onload="alert(1)">';
      const output = sanitizeHTML(input);
      expect(output).toBe('<img src="x">');
      expect(output).not.toContain('onload');
    });

    it('should remove javascript: protocol from links', () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const output = sanitizeHTML(input);
      expect(output).not.toContain('javascript:');
      // DOMPurify removes unsafe href, keeps tag and content
      expect(output).toContain('Link');
    });

    it('should remove iframe tags (not in allowlist)', () => {
      const input = '<iframe src="x"></iframe>';
      const output = sanitizeHTML(input);
      expect(output).toBe('');
      expect(output).not.toContain('iframe');
    });

    it('should remove data: protocol from links', () => {
      const input = '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Link</a>';
      const output = sanitizeHTML(input);
      expect(output.toLowerCase()).not.toContain('data:text/html');
      expect(output).toContain('Link');
    });

    it('should remove vbscript: protocol from links', () => {
      const input = '<a href="vbscript:msgbox(1)">Link</a>';
      const output = sanitizeHTML(input);
      expect(output.toLowerCase()).not.toContain('vbscript:');
      expect(output).toContain('Link');
    });

    it('should remove encoded/whitespace javascript: protocol variants', () => {
      const inputs = [
        '<a href="  javascript:alert(1)">X</a>',
        '<a href="&#106;avascript:alert(1)">X</a>',
        '<a href="&#x6a;avascript:alert(1)">X</a>',
      ];

      inputs.forEach((input) => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('javascript:');
      });
    });

    it('should remove svg and mathml tags (not in allowlist)', () => {
      const input = '<svg onload="alert(1)"><circle /></svg><math><mi>x</mi></math>';
      const output = sanitizeHTML(input);
      expect(output.toLowerCase()).not.toContain('svg');
      expect(output.toLowerCase()).not.toContain('math');
      expect(output.toLowerCase()).not.toContain('onload');
    });
  });

  describe('data-attribute handling', () => {
    it('should allow data-action attribute', () => {
      const input = '<button data-action="submit">Go</button>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<button data-action="submit">Go</button>');
    });

    it('should allow data-payload attribute', () => {
      const input = '<div data-payload=\'{"id":1}\'>X</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div data-payload="{&quot;id&quot;:1}">X</div>');
      expect(output).toContain('data-payload');
    });

    it('should remove arbitrary data-* attributes not in allowlist', () => {
      const input = '<div data-foo="bar">X</div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div>X</div>');
      expect(output).not.toContain('data-foo');
    });
  });

  describe('tag allowlist enforcement', () => {
    it('should remove custom tags but preserve content', () => {
      const input = '<custom-tag>X</custom-tag>';
      const output = sanitizeHTML(input);
      expect(output).toBe('X');
      expect(output).not.toContain('custom-tag');
    });

    it('should allow all tags in allowlist', () => {
      const allowedTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a', 'ul', 'ol', 'li', 'img'];

      allowedTags.forEach(tag => {
        const input = `<${tag}>content</${tag}>`;
        const output = sanitizeHTML(input);
        expect(output).toContain(tag);
      });
    });

    it('should remove disallowed tags but keep content', () => {
      const input = '<section><article>Text</article></section>';
      const output = sanitizeHTML(input);
      expect(output).toBe('Text');
      expect(output).not.toContain('section');
      expect(output).not.toContain('article');
    });
  });

  describe('attribute allowlist enforcement', () => {
    it('should allow class attribute', () => {
      const input = '<div class="test">X</div>';
      const output = sanitizeHTML(input);
      expect(output).toContain('class="test"');
    });

    it('should allow id attribute', () => {
      const input = '<div id="test">X</div>';
      const output = sanitizeHTML(input);
      expect(output).toContain('id="test"');
    });

    it('should allow href on links', () => {
      const input = '<a href="/test">Link</a>';
      const output = sanitizeHTML(input);
      expect(output).toContain('href="/test"');
    });

    it('should allow src and alt on images', () => {
      const input = '<img src="/test.jpg" alt="Test">';
      const output = sanitizeHTML(input);
      expect(output).toContain('src="/test.jpg"');
      expect(output).toContain('alt="Test"');
    });

    it('should remove disallowed attributes', () => {
      const input = '<div style="color: red" title="test">X</div>';
      const output = sanitizeHTML(input);
      expect(output).not.toContain('style');
      expect(output).not.toContain('title');
      expect(output).toBe('<div>X</div>');
    });

    it('should remove srcset attribute from images', () => {
      const input = '<img src="/a.jpg" srcset="/a.jpg 1x, /b.jpg 2x" alt="A">';
      const output = sanitizeHTML(input);
      expect(output).toContain('src="/a.jpg"');
      expect(output).not.toContain('srcset');
    });
  });

  describe('critical security tests', () => {
    it('should never output script tag', () => {
      const inputs = [
        '<script>alert(1)</script>',
        '<SCRIPT>alert(1)</SCRIPT>',
        '<script src="evil.js"></script>',
        '<div><script>nested</script></div>',
      ];

      inputs.forEach(input => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('script');
      });
    });

    it('should never output onclick attribute', () => {
      const inputs = [
        '<div onclick="alert(1)">X</div>',
        '<button ONCLICK="alert(1)">X</button>',
        '<a onclick="steal()">X</a>',
      ];

      inputs.forEach(input => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('onclick');
      });
    });

    it('should never output onerror attribute', () => {
      const inputs = [
        '<img onerror="alert(1)">',
        '<img ONERROR="alert(1)">',
        '<div onerror="x">X</div>',
      ];

      inputs.forEach(input => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('onerror');
      });
    });

    it('should never output javascript: protocol', () => {
      const inputs = [
        '<a href="javascript:alert(1)">X</a>',
        '<a href="JAVASCRIPT:alert(1)">X</a>',
        '<a href="jAvAsCrIpT:alert(1)">X</a>',
      ];

      inputs.forEach(input => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('javascript:');
      });
    });

    it('should never output onload attribute', () => {
      const inputs = [
        '<img onload="alert(1)">',
        '<body onload="alert(1)">X</body>',
      ];

      inputs.forEach(input => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('onload');
      });
    });

    it('should never output onmouseover attribute', () => {
      const inputs = [
        '<div onmouseover="alert(1)">X</div>',
        '<a ONMOUSEOVER="alert(1)">X</a>',
      ];

      inputs.forEach(input => {
        const output = sanitizeHTML(input);
        expect(output.toLowerCase()).not.toContain('onmouseover');
      });
    });
  });

  describe('content preservation edge cases', () => {
    it('should preserve text content with special characters', () => {
      const input = '<div>Text with & < > " \' characters</div>';
      const output = sanitizeHTML(input);
      expect(output).toContain('&amp;');
      expect(output).toContain('&lt;');
      expect(output).toContain('&gt;');
    });

    it('should preserve nested structure', () => {
      const input = '<div><ul><li>Item 1</li><li>Item 2</li></ul></div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div><ul><li>Item 1</li><li>Item 2</li></ul></div>');
    });

    it('should handle empty elements', () => {
      const input = '<div></div>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<div></div>');
    });

    it('should handle self-closing tags', () => {
      const input = '<img src="test.jpg" alt="Test">';
      const output = sanitizeHTML(input);
      expect(output).toBe('<img src="test.jpg" alt="Test">');
    });
  });
});
