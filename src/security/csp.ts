/**
 * CSP runtime guard
 *
 * emmet-ui sanitizes HTML, but host apps should also set CSP.
 * We do a best-effort browser-side check and warn once when missing.
 */

let hasCheckedCSP = false;

/**
 * Warn once when CSP appears missing in browser document metadata.
 *
 * Notes:
 * - This checks only for a CSP meta tag (what is observable in runtime DOM).
 * - Stronger deployments should set CSP via HTTP headers.
 */
export function warnIfMissingCSP(): void {
  if (hasCheckedCSP) return;
  hasCheckedCSP = true;

  if (typeof document === 'undefined') {
    return;
  }

  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy" i]');

  if (!cspMeta) {
    console.warn(
      '[emmet-ui] Security warning: No Content-Security-Policy (CSP) meta tag detected. ' +
      'For defense-in-depth, configure CSP (preferably via HTTP response headers) in the host application.'
    );
  }
}

/** @internal test helper */
export function __resetCSPWarningForTests(): void {
  hasCheckedCSP = false;
}
