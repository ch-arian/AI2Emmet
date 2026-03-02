/**
 * Default Component Registry
 *
 * Pre-populated registry with all default components.
 * Used by pipeline when no custom registry provided.
 */

import { ComponentRegistry } from './ComponentRegistry';
import { Button, Card, Container, Heading, Paragraph, Span } from '../components';

/**
 * Creates a fresh registry instance with all default components.
 *
 * Factory function is useful when user wants a fresh registry to extend
 * without mutating the shared default singleton.
 *
 * @returns New ComponentRegistry with all default components
 *
 * @example
 * ```typescript
 * // Get fresh registry to extend
 * const customRegistry = createDefaultRegistry();
 * customRegistry.register('myComponent', MyComponent);
 * // defaultRegistry is not affected
 * ```
 */
export function createDefaultRegistry(): ComponentRegistry {
  return new ComponentRegistry({
    entries: [
      { tag: 'btn', component: Button },
      { tag: 'button', component: Button }, // Emmet expands 'btn' to 'button', so register both
      { tag: 'card', component: Card },
      { tag: 'container', component: Container },
      { tag: 'div', component: Container },
      { tag: 'h1', component: Heading },
      { tag: 'p', component: Paragraph },
      { tag: 'span', component: Span },
    ]
  });
}

/**
 * Default registry singleton used by pipeline.
 *
 * Pre-populated with all default components:
 * - btn/button -> Button (both registered because Emmet expands 'btn' to 'button')
 * - card -> Card
 * - container/div -> Container
 * - h1 -> Heading
 * - p -> Paragraph
 * - span -> Span
 *
 * @example
 * ```typescript
 * // Used automatically by pipeline
 * pipeline('btn{Click}') // uses defaultRegistry
 *
 * // Or access directly
 * defaultRegistry.get('btn') // => Button component
 * defaultRegistry.get('button') // => Button component (same as 'btn')
 * ```
 */
export const defaultRegistry = createDefaultRegistry();
