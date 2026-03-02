/**
 * HTML to React Hydration Pipeline Stage
 *
 * Converts sanitized HTML strings into React elements using html-react-parser.
 * Provides extensible replace option for Phase 2 component registry integration.
 *
 * IMPORTANT: Do NOT use the index parameter from replace callback as React key.
 * This causes render bugs because index resets to 0 for each parent's children,
 * creating duplicate keys. (Source: html-react-parser README, RESEARCH.md pitfall #6)
 */

import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
import type { ReactElement } from 'react';

/**
 * Replace callback type for transforming DOM nodes to React elements.
 * Returns ReactElement, null (to remove node but keep children), or void (no transformation).
 *
 * Note: Do NOT use the index parameter as React key - causes render bugs.
 * (Source: html-react-parser README, RESEARCH.md pitfall #6)
 */
export type ReplaceCallback = (domNode: Element) => ReactElement | object | void | null;

/**
 * Creates html-react-parser options object with optional replace callback.
 *
 * This allows Phase 2 to inject component registry replace logic while
 * keeping the hydration wrapper simple and testable.
 *
 * @param replace - Optional replace callback to transform DOM nodes into React components
 * @returns HTMLReactParserOptions configuration object
 *
 * @example
 * ```typescript
 * // Basic usage (no transformations)
 * const options = createHydrateOptions();
 *
 * // With custom replace (Phase 2 component registry)
 * const options = createHydrateOptions((domNode) => {
 *   if (domNode.name === 'btn') {
 *     return <Button>{domToReact(domNode.children, options)}</Button>;
 *   }
 * });
 * ```
 */
export function createHydrateOptions(
  replace?: ReplaceCallback
): HTMLReactParserOptions {
  if (!replace) {
    return {};
  }

  return {
    replace(domNode: DOMNode) {
      // Type guard: only process Element nodes
      if (!(domNode instanceof Element)) {
        return;
      }

      return replace(domNode);
    },
  };
}

/**
 * Converts sanitized HTML string to React element tree.
 *
 * @param html - Sanitized HTML string (from DOMPurify)
 * @param options - Optional html-react-parser configuration (for component registry)
 * @returns React element, array of elements, or string (for text nodes)
 *
 * @example
 * ```typescript
 * // Basic hydration
 * hydrateToReact('<div class="card"><p>Hello</p></div>')
 * // => React.createElement('div', { className: 'card' }, ...)
 *
 * // With custom replace options (Phase 2)
 * const options = createHydrateOptions(componentRegistryReplace);
 * hydrateToReact('<btn>Click me</btn>', options)
 * // => <Button>Click me</Button>
 * ```
 */
export function hydrateToReact(
  html: string,
  options?: HTMLReactParserOptions
): ReturnType<typeof parse> {
  return parse(html, options);
}
