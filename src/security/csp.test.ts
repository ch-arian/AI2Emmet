import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { warnIfMissingCSP, __resetCSPWarningForTests } from './csp';

describe('warnIfMissingCSP', () => {
  beforeEach(() => {
    __resetCSPWarningForTests();
    document.head.innerHTML = '';
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns when CSP meta tag is missing', () => {
    warnIfMissingCSP();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('No Content-Security-Policy (CSP) meta tag detected')
    );
  });

  it('does not warn when CSP meta tag exists', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', "default-src 'self'");
    document.head.appendChild(meta);

    warnIfMissingCSP();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('warns only once', () => {
    warnIfMissingCSP();
    warnIfMissingCSP();

    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
