/**
 * Pipeline Orchestrator
 *
 * Composes all pipeline stages into a single function:
 * Emmet -> HTML -> Safe HTML -> React
 *
 * Security critical: Always sanitize before hydrating to prevent XSS.
 */

import { expandEmmet } from './expand';
import { sanitizeHTML } from './sanitize';
import { hydrateToReact, createHydrateOptions } from './hydrate';
import { createReplaceCallback } from '../registry/createReplaceCallback';
import { defaultRegistry } from '../registry/defaultRegistry';
import type { EmmetString, PipelineOptions, PipelineResult } from '../types';

/**
 * Converts Emmet abbreviation to React element tree.
 *
 * Pipeline stages (in order):
 * 1. expandEmmet: Emmet -> HTML
 * 2. sanitizeHTML: HTML -> Safe HTML (XSS removal)
 * 3. hydrateToReact: Safe HTML -> React
 *
 * @param emmet - Valid Emmet abbreviation
 * @param options - Optional pipeline configuration (for Phase 2+)
 * @returns React element, array of elements, or string
 *
 * @throws Error if Emmet is invalid or empty
 *
 * @example
 * ```typescript
 * // Basic usage
 * pipeline('div.card>h1{Title}+p{Content}')
 * // => <div className="card"><h1>Title</h1><p>Content</p></div>
 *
 * // XSS protection
 * pipeline('div{<script>alert(1)</script>}')
 * // => <div>alert(1)</div> (script tags stripped)
 *
 * // Tailwind classes
 * pipeline('div[class="hover:bg-blue-500"]')
 * // => <div className="hover:bg-blue-500"></div>
 *
 * // Action attributes (for Phase 3)
 * pipeline('button[data-action="submit"]{Submit}')
 * // => <button data-action="submit">Submit</button>
 * ```
 */
export function pipeline(
  emmet: string,
  options?: PipelineOptions
): PipelineResult {
  // Stage 1: Expand Emmet to HTML
  const html = expandEmmet(emmet as EmmetString);

  // Stage 2: Sanitize HTML (critical for security)
  const safeHtml = sanitizeHTML(html);

  // Stage 3: Hydrate to React with component registry
  const registry = options?.registry ?? defaultRegistry;
  const replace = createReplaceCallback(registry);
  const hydrateOptions = createHydrateOptions(replace);
  return hydrateToReact(safeHtml, hydrateOptions);
}

// Re-export all stage functions for advanced usage
export { expandEmmet } from './expand';
export { sanitizeHTML } from './sanitize';
export { hydrateToReact, createHydrateOptions } from './hydrate';

// Re-export types
export type { ReplaceCallback } from './hydrate';
export type { EmmetString, HTMLString, SafeHTMLString, PipelineOptions, PipelineResult } from '../types';
