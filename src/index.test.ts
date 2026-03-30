import { describe, it, expect } from 'vitest';
import * as api from './index';

describe('public API exports', () => {
  it('exports core runtime APIs', () => {
    expect(typeof api.pipeline).toBe('function');
    expect(typeof api.expandEmmet).toBe('function');
    expect(typeof api.sanitizeHTML).toBe('function');
    expect(typeof api.hydrateToReact).toBe('function');
    expect(typeof api.createHydrateOptions).toBe('function');
  });

  it('exports registry and actions APIs', () => {
    expect(api.ComponentRegistry).toBeDefined();
    expect(api.defaultRegistry).toBeDefined();
    expect(typeof api.createDefaultRegistry).toBe('function');
    expect(typeof api.createReplaceCallback).toBe('function');
    expect(typeof api.parsePayload).toBe('function');
    expect(typeof api.useActionHandler).toBe('function');
  });

  it('exports high-level rendering APIs', () => {
    expect(typeof api.EmmetRenderer).toBe('function');
    expect(typeof api.useEmmetRenderer).toBe('function');
    expect(typeof api.ErrorFallback).toBe('function');
    expect(typeof api.LoadingSkeleton).toBe('function');
  });
});
