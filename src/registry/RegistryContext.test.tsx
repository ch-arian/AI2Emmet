import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ComponentRegistry } from './ComponentRegistry';
import { defaultRegistry } from './defaultRegistry';
import { RegistryProvider, useRegistry } from './RegistryContext';
import { Button } from '../components';

describe('RegistryContext', () => {
  it('should return defaultRegistry when no provider', () => {
    let registryFromHook: ComponentRegistry | null = null;

    function TestComponent() {
      registryFromHook = useRegistry();
      return null;
    }

    render(<TestComponent />);

    expect(registryFromHook).toBe(defaultRegistry);
  });

  it('should return custom registry when inside RegistryProvider', () => {
    const customRegistry = new ComponentRegistry({
      entries: [{ tag: 'custom', component: Button }]
    });

    let registryFromHook: ComponentRegistry | null = null;

    function TestComponent() {
      registryFromHook = useRegistry();
      return null;
    }

    render(
      <RegistryProvider registry={customRegistry}>
        <TestComponent />
      </RegistryProvider>
    );

    expect(registryFromHook).toBe(customRegistry);
    expect(registryFromHook?.get('custom')).toBe(Button);
  });

  it('should handle nested providers (inner wins)', () => {
    const outerRegistry = new ComponentRegistry();
    const innerRegistry = new ComponentRegistry({
      entries: [{ tag: 'inner', component: Button }]
    });

    let registryFromHook: ComponentRegistry | null = null;

    function TestComponent() {
      registryFromHook = useRegistry();
      return null;
    }

    render(
      <RegistryProvider registry={outerRegistry}>
        <RegistryProvider registry={innerRegistry}>
          <TestComponent />
        </RegistryProvider>
      </RegistryProvider>
    );

    expect(registryFromHook).toBe(innerRegistry);
    expect(registryFromHook?.get('inner')).toBe(Button);
  });
});
