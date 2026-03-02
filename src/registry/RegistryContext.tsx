/**
 * React Context for Component Registry
 *
 * Provides app-wide access to the component registry via React Context.
 * Allows users to provide custom registries while defaulting to the standard registry.
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { ComponentRegistry } from './ComponentRegistry';
import { defaultRegistry } from './defaultRegistry';

const RegistryContext = createContext<ComponentRegistry>(defaultRegistry);

export interface RegistryProviderProps {
  registry: ComponentRegistry;
  children: ReactNode;
}

/**
 * Provider component for custom component registry.
 *
 * Wraps your app to provide a custom registry to all EmmetRenderer components.
 * If not used, components will use the defaultRegistry.
 *
 * @example
 * ```tsx
 * const customRegistry = createDefaultRegistry();
 * customRegistry.register('myComponent', MyComponent);
 *
 * <RegistryProvider registry={customRegistry}>
 *   <App />
 * </RegistryProvider>
 * ```
 */
export function RegistryProvider({ registry, children }: RegistryProviderProps) {
  return (
    <RegistryContext.Provider value={registry}>
      {children}
    </RegistryContext.Provider>
  );
}

/**
 * Hook to access the current component registry from context.
 *
 * Returns the custom registry if inside a RegistryProvider,
 * otherwise returns the defaultRegistry.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const registry = useRegistry();
 *   const ButtonComponent = registry.get('btn');
 *   return <ButtonComponent>Click</ButtonComponent>;
 * }
 * ```
 */
export function useRegistry(): ComponentRegistry {
  return useContext(RegistryContext);
}
