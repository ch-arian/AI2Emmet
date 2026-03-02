/**
 * Replace Callback Factory
 *
 * Creates html-react-parser replace callback that transforms HTML elements
 * into registered React components.
 *
 * Used by pipeline to integrate component registry with hydration.
 */

import { createElement, type ReactElement } from 'react';
import { domToReact, Element, type HTMLReactParserOptions } from 'html-react-parser';
import type { ComponentRegistry } from './ComponentRegistry';
import { UnknownTag } from '../components';
import type { ReplaceCallback } from '../pipeline/hydrate';
import { SANITIZER_CONFIG } from '../config/sanitizer';

/** Set of standard HTML tags that should pass through without replacement */
const HTML_TAGS = new Set(SANITIZER_CONFIG.ALLOWED_TAGS);

/**
 * Creates replace callback for html-react-parser that uses component registry.
 *
 * Process:
 * 1. Look up tag name in registry
 * 2. If found: render registered component with props
 * 3. If not found: render UnknownTag error placeholder (but still transforms children)
 *
 * Props extraction:
 * - class -> className (React convention)
 * - All other attributes pass through unchanged
 * - Children converted via domToReact WITH options to enable recursive transformation
 *
 * IMPORTANT: This uses a self-referential options object. The callback references
 * the options, and the options contain the callback. This enables nested element
 * transformation.
 *
 * @param registry - ComponentRegistry to look up components
 * @returns Replace callback function for html-react-parser
 *
 * @example
 * ```typescript
 * const registry = new ComponentRegistry({
 *   entries: [{ tag: 'btn', component: Button }]
 * });
 *
 * const replace = createReplaceCallback(registry);
 * const hydrateOptions = createHydrateOptions(replace);
 *
 * hydrateToReact('<btn class="primary">Click</btn>', hydrateOptions);
 * // => <Button className="primary">Click</Button>
 *
 * hydrateToReact('<unknown>Test</unknown>', hydrateOptions);
 * // => <UnknownTag tagName="unknown">Test</UnknownTag>
 * ```
 */
export function createReplaceCallback(
  registry: ComponentRegistry
): ReplaceCallback {
  // Create options object for recursive processing
  const options: HTMLReactParserOptions = {};

  const callback: ReplaceCallback = (domNode: Element): ReactElement | void => {
    const tagName = domNode.name;

    // Standard HTML tag - let html-react-parser handle it natively
    if (!tagName || HTML_TAGS.has(tagName)) {
      return;
    }

    // Convert children with options that include the replace callback for recursive processing
    const domChildren = domNode.children || [];
    const children = domChildren.length > 0 ? domToReact(domChildren as any, options) : undefined;

    const Component = registry.get(tagName);

    if (!Component) {
      // Unknown tag - render error placeholder
      const attributes = domNode.attribs || {};
      return createElement(UnknownTag, {
        tagName,
        attributes,
        children
      });
    }

    // Extract props from DOM attributes
    const { class: className, ...restAttribs } = domNode.attribs || {};

    // Render registered component
    return createElement(Component, {
      className,
      ...restAttribs,
      children
    });
  };

  // Set up self-referential options WITH Element type guard for recursive processing
  options.replace = (domNode) => {
    if (domNode instanceof Element) {
      return callback(domNode);
    }
  };

  return callback;
}
