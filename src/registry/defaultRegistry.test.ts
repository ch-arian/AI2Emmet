import { describe, it, expect } from 'vitest';
import { defaultRegistry, createDefaultRegistry } from './defaultRegistry';
import { Button, Card, Container, Heading, Paragraph, Span } from '../components';

describe('defaultRegistry', () => {
  it('should have all default components registered', () => {
    expect(defaultRegistry.has('btn')).toBe(true);
    expect(defaultRegistry.has('card')).toBe(true);
    expect(defaultRegistry.has('container')).toBe(true);
    expect(defaultRegistry.has('div')).toBe(true);
    expect(defaultRegistry.has('h1')).toBe(true);
    expect(defaultRegistry.has('p')).toBe(true);
    expect(defaultRegistry.has('span')).toBe(true);
  });

  it('should map btn to Button component', () => {
    expect(defaultRegistry.get('btn')).toBe(Button);
  });

  it('should map card to Card component', () => {
    expect(defaultRegistry.get('card')).toBe(Card);
  });

  it('should map container to Container component', () => {
    expect(defaultRegistry.get('container')).toBe(Container);
  });

  it('should map div to Container component', () => {
    expect(defaultRegistry.get('div')).toBe(Container);
  });

  it('should map h1 to Heading component', () => {
    expect(defaultRegistry.get('h1')).toBe(Heading);
  });

  it('should map p to Paragraph component', () => {
    expect(defaultRegistry.get('p')).toBe(Paragraph);
  });

  it('should map span to Span component', () => {
    expect(defaultRegistry.get('span')).toBe(Span);
  });

  it('should return undefined for unknown tags', () => {
    expect(defaultRegistry.get('unknown')).toBeUndefined();
    expect(defaultRegistry.get('custom')).toBeUndefined();
  });
});

describe('createDefaultRegistry', () => {
  it('should return new registry instance each time', () => {
    const registry1 = createDefaultRegistry();
    const registry2 = createDefaultRegistry();

    expect(registry1).not.toBe(registry2);
  });

  it('should return registry with all default components', () => {
    const registry = createDefaultRegistry();

    expect(registry.get('btn')).toBe(Button);
    expect(registry.get('card')).toBe(Card);
    expect(registry.get('container')).toBe(Container);
    expect(registry.get('div')).toBe(Container);
    expect(registry.get('h1')).toBe(Heading);
    expect(registry.get('p')).toBe(Paragraph);
    expect(registry.get('span')).toBe(Span);
  });

  it('should allow extending without affecting default registry', () => {
    const customRegistry = createDefaultRegistry();

    // Mock custom component
    const CustomComponent = () => null;
    customRegistry.register('custom', CustomComponent);

    // Custom registry has the new component
    expect(customRegistry.get('custom')).toBe(CustomComponent);

    // Default registry is unaffected
    expect(defaultRegistry.get('custom')).toBeUndefined();
  });

  it('should allow extending without affecting other instances', () => {
    const registry1 = createDefaultRegistry();
    const registry2 = createDefaultRegistry();

    // Mock custom components
    const Component1 = () => null;
    const Component2 = () => null;

    registry1.register('custom1', Component1);
    registry2.register('custom2', Component2);

    // Each registry has only its own custom component
    expect(registry1.get('custom1')).toBe(Component1);
    expect(registry1.get('custom2')).toBeUndefined();

    expect(registry2.get('custom1')).toBeUndefined();
    expect(registry2.get('custom2')).toBe(Component2);
  });
});
