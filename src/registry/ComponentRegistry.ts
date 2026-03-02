import type { ComponentType } from 'react';
import type { ComponentMap, ComponentEntry, RegistryOptions } from '../types/registry';

/**
 * Registry mapping Emmet tag names to React components.
 *
 * Components in registry are used by the hydrator's replace callback
 * to transform HTML elements into custom React components.
 *
 * @example
 * ```typescript
 * const registry = new ComponentRegistry({
 *   entries: [{ tag: 'btn', component: Button }]
 * });
 *
 * registry.register('card', Card);
 * registry.get('btn'); // => Button component
 * ```
 */
export class ComponentRegistry {
  private readonly components: ComponentMap;

  constructor(options?: RegistryOptions) {
    this.components = new Map();

    if (options?.entries) {
      for (const { tag, component } of options.entries) {
        this.components.set(tag, component);
      }
    }
  }

  /**
   * Get component for tag name.
   * Returns undefined if tag not registered.
   */
  get(tag: string): ComponentType<any> | undefined {
    return this.components.get(tag);
  }

  /**
   * Register component for tag name.
   * Overrides existing registration if tag already exists.
   * Returns registry for method chaining.
   */
  register(tag: string, component: ComponentType<any>): this {
    this.components.set(tag, component);
    return this;
  }

  /**
   * Check if tag is registered.
   */
  has(tag: string): boolean {
    return this.components.has(tag);
  }

  /**
   * Get all registered components as immutable map.
   * Returns a copy - mutations do not affect registry.
   */
  getAll(): ReadonlyMap<string, ComponentType<any>> {
    return new Map(this.components);
  }
}
