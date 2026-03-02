/**
 * DOMPurify configuration for HTML sanitization
 *
 * Security constraints:
 * - Explicit allowlist for tags and attributes
 * - No USE_PROFILES (conflicts with ALLOWED_TAGS)
 * - ALLOW_DATA_ATTR: false (explicitly allowlist data-action, data-payload)
 * - KEEP_CONTENT: true (preserve text when removing unsafe tags)
 */

export const SANITIZER_CONFIG = {
  // Allowlisted HTML tags
  ALLOWED_TAGS: [
    'div',
    'span',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'button',
    'a',
    'ul',
    'ol',
    'li',
    'img',
  ],

  // Allowlisted attributes
  ALLOWED_ATTR: [
    'class',
    'id',
    'href',
    'src',
    'alt',
    'data-action',
    'data-payload',
  ],

  // Disable automatic data-* allowlisting (we explicitly allowlist above)
  ALLOW_DATA_ATTR: false,

  // Disable ARIA attributes unless needed
  ALLOW_ARIA_ATTR: false,

  // Keep text content when removing unsafe tags
  KEEP_CONTENT: true,

  // Return sanitized HTML as string (for html-react-parser)
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};
