import type { ComponentType } from 'react';

/**
 * Map of tag names to React components.
 */
export type ComponentMap = Map<string, ComponentType<any>>;

/**
 * Single registry entry mapping tag to component.
 */
export interface ComponentEntry {
  tag: string;
  component: ComponentType<any>;
}

/**
 * Options for ComponentRegistry constructor.
 */
export interface RegistryOptions {
  entries?: ComponentEntry[];
}
