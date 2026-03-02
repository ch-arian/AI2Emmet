/**
 * HTML Sanitization Pipeline Stage
 *
 * Uses DOMPurify with strict allowlist configuration to remove XSS vectors
 * from expanded HTML before React hydration.
 *
 * Security model:
 * - Explicit tag allowlist (no arbitrary HTML elements)
 * - Explicit attribute allowlist (including data-action, data-payload for action system)
 * - Event handlers stripped (onclick, onerror, etc.)
 * - Dangerous protocols removed (javascript:, data:, etc.)
 * - Text content preserved when unsafe tags removed (KEEP_CONTENT: true)
 */

import DOMPurify from 'isomorphic-dompurify';
import { SANITIZER_CONFIG } from '../config/sanitizer';

/**
 * Sanitizes HTML string using DOMPurify with strict allowlist configuration.
 *
 * @param html - Raw HTML string (typically from Emmet expansion)
 * @returns Sanitized HTML string safe for React hydration
 *
 * @example
 * ```typescript
 * // Safe HTML passes through
 * sanitizeHTML('<div class="card">Hello</div>')
 * // => '<div class="card">Hello</div>'
 *
 * // XSS vectors removed
 * sanitizeHTML('<script>alert("xss")</script>')
 * // => ''
 *
 * // Event handlers stripped
 * sanitizeHTML('<div onclick="alert(1)">Click</div>')
 * // => '<div>Click</div>'
 *
 * // Action system attributes preserved
 * sanitizeHTML('<button data-action="submit">Go</button>')
 * // => '<button data-action="submit">Go</button>'
 * ```
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, SANITIZER_CONFIG);
}
