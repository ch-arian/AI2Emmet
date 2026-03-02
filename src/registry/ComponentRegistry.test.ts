import { describe, it, expect } from 'vitest';
import { ComponentRegistry } from './ComponentRegistry';
import type { FC } from 'react';

// Mock components for testing
const MockButton: FC = () => null;
const MockCard: FC = () => null;
const MockCustom: FC = () => null;

describe('ComponentRegistry', () => {
  describe('constructor', () => {
    it('creates empty registry by default', () => {
      const registry = new ComponentRegistry();
      expect(registry.getAll().size).toBe(0);
    });

    it('accepts initial entries via options', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      expect(registry.get('btn')).toBe(MockButton);
    });

    it('accepts multiple initial entries', () => {
      const registry = new ComponentRegistry({
        entries: [
          { tag: 'btn', component: MockButton },
          { tag: 'card', component: MockCard }
        ]
      });
      expect(registry.getAll().size).toBe(2);
    });
  });

  describe('get', () => {
    it('returns registered component', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      expect(registry.get('btn')).toBe(MockButton);
    });

    it('returns undefined for unregistered tag', () => {
      const registry = new ComponentRegistry();
      expect(registry.get('unknown')).toBeUndefined();
    });

    it('is case-sensitive', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      expect(registry.get('BTN')).toBeUndefined();
    });
  });

  describe('register', () => {
    it('adds new component to registry', () => {
      const registry = new ComponentRegistry();
      registry.register('custom', MockCustom);
      expect(registry.get('custom')).toBe(MockCustom);
    });

    it('overrides existing component', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      registry.register('btn', MockCustom);
      expect(registry.get('btn')).toBe(MockCustom);
    });

    it('returns the registry for chaining', () => {
      const registry = new ComponentRegistry();
      const result = registry.register('a', MockButton).register('b', MockCard);
      expect(result).toBe(registry);
      expect(registry.getAll().size).toBe(2);
    });
  });

  describe('has', () => {
    it('returns true for registered tag', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      expect(registry.has('btn')).toBe(true);
    });

    it('returns false for unregistered tag', () => {
      const registry = new ComponentRegistry();
      expect(registry.has('unknown')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('returns ReadonlyMap', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      const all = registry.getAll();
      expect(all).toBeInstanceOf(Map);
      expect(all.get('btn')).toBe(MockButton);
    });

    it('map mutations do not affect registry', () => {
      const registry = new ComponentRegistry({
        entries: [{ tag: 'btn', component: MockButton }]
      });
      const all = registry.getAll();
      // TypeScript prevents this at compile time, but test runtime behavior
      (all as Map<string, unknown>).set('hacked', MockCustom);
      // Original registry unchanged (getAll returns new Map copy)
      expect(registry.has('hacked')).toBe(false);
    });
  });
});
