import { describe, it, expect } from 'vitest';
import { hydrateToReact, createHydrateOptions } from './hydrate';
import { createElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { Element } from 'html-react-parser';

describe('hydrateToReact', () => {
  it('converts simple div with text to React element', () => {
    const result = hydrateToReact('<div>Hello</div>');

    expect(isValidElement(result)).toBe(true);

    // Cast to ReactElement to access props
    const element = result as ReactElement;
    expect(element.type).toBe('div');
    expect(element.props.children).toBe('Hello');
  });

  it('converts class attribute to className prop', () => {
    const result = hydrateToReact('<div class="card"></div>');

    expect(isValidElement(result)).toBe(true);

    const element = result as ReactElement;
    expect(element.type).toBe('div');
    expect(element.props.className).toBe('card');
  });

  it('renders nested elements correctly', () => {
    const result = hydrateToReact('<div><p>Nested</p></div>');

    expect(isValidElement(result)).toBe(true);

    const element = result as ReactElement;
    expect(element.type).toBe('div');
    expect(isValidElement(element.props.children)).toBe(true);

    const child = element.props.children as ReactElement;
    expect(child.type).toBe('p');
    expect(child.props.children).toBe('Nested');
  });

  it('preserves text content in mixed content', () => {
    const result = hydrateToReact('<p>Text <span>nested</span> more</p>');

    expect(isValidElement(result)).toBe(true);

    const element = result as ReactElement;
    expect(element.type).toBe('p');

    // Children should be an array: ['Text ', <span>, ' more']
    const children = element.props.children;
    expect(Array.isArray(children)).toBe(true);
    expect(children[0]).toBe('Text ');

    const span = children[1] as ReactElement;
    expect(span.type).toBe('span');
    expect(span.props.children).toBe('nested');

    expect(children[2]).toBe(' more');
  });

  it('returns null for empty string', () => {
    const result = hydrateToReact('');

    // html-react-parser returns [] for empty string
    expect(result).toEqual([]);
  });

  it('handles multiple root elements as array', () => {
    const result = hydrateToReact('<div>First</div><div>Second</div>');

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);

    const [first, second] = result as ReactElement[];
    expect(first.type).toBe('div');
    expect(first.props.children).toBe('First');
    expect(second.type).toBe('div');
    expect(second.props.children).toBe('Second');
  });
});

describe('createHydrateOptions', () => {
  it('returns empty object when no replace function provided', () => {
    const options = createHydrateOptions();

    expect(options).toEqual({});
  });

  it('accepts replace callback and wraps it with type guard', () => {
    const mockReplace = (domNode: Element) => {
      if (domNode.name === 'custom') {
        return createElement('div', { className: 'replaced' });
      }
    };

    const options = createHydrateOptions(mockReplace);

    expect(options).toHaveProperty('replace');
    expect(typeof options.replace).toBe('function');
  });

  it('custom replace option works with hydrateToReact', () => {
    const options = createHydrateOptions((domNode) => {
      if (domNode.name === 'custom') {
        return createElement('div', { className: 'replaced' }, 'Transformed');
      }
    });

    const result = hydrateToReact('<custom>Original</custom>', options);

    expect(isValidElement(result)).toBe(true);

    const element = result as ReactElement;
    expect(element.type).toBe('div');
    expect(element.props.className).toBe('replaced');
    expect(element.props.children).toBe('Transformed');
  });

  it('replace callback receives Element nodes only', () => {
    let receivedNodeTypes: string[] = [];

    const options = createHydrateOptions((domNode) => {
      receivedNodeTypes.push(domNode.constructor.name);
      // Don't replace anything, just track types
    });

    hydrateToReact('<div>Text <span>nested</span></div>', options);

    // Should only receive Element instances, not Text nodes
    expect(receivedNodeTypes.every(type => type === 'Element')).toBe(true);
  });
});

describe('hydration integration', () => {
  it('converts complex HTML structure to React tree', () => {
    const html = '<div class="card"><h1>Title</h1><p class="content">Text</p></div>';
    const result = hydrateToReact(html);

    expect(isValidElement(result)).toBe(true);

    const element = result as ReactElement;
    expect(element.type).toBe('div');
    expect(element.props.className).toBe('card');

    const [h1, p] = element.props.children as ReactElement[];
    expect(h1.type).toBe('h1');
    expect(h1.props.children).toBe('Title');
    expect(p.type).toBe('p');
    expect(p.props.className).toBe('content');
    expect(p.props.children).toBe('Text');
  });

  it('handles void elements correctly', () => {
    const result = hydrateToReact('<img src="test.jpg" alt="Test" />');

    expect(isValidElement(result)).toBe(true);

    const element = result as ReactElement;
    expect(element.type).toBe('img');
    expect(element.props.src).toBe('test.jpg');
    expect(element.props.alt).toBe('Test');
  });
});
