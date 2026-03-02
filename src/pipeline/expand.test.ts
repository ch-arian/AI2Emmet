import { describe, it, expect } from 'vitest';
import { expandEmmet } from './expand';

describe('expandEmmet', () => {
  it('expands simple div', () => {
    expect(expandEmmet('div')).toBe('<div></div>');
  });

  it('expands div with single class', () => {
    expect(expandEmmet('div.card')).toBe('<div class="card"></div>');
  });

  it('expands div with id', () => {
    expect(expandEmmet('div#main')).toBe('<div id="main"></div>');
  });

  it('expands div with multiple classes', () => {
    expect(expandEmmet('div.card.shadow')).toBe('<div class="card shadow"></div>');
  });

  it('expands nested elements with child combinator', () => {
    expect(expandEmmet('div>p')).toBe('<div><p></p></div>');
  });

  it('expands sibling elements', () => {
    expect(expandEmmet('div>p+span')).toBe('<div><p></p><span></span></div>');
  });

  it('expands element with text content', () => {
    expect(expandEmmet('h1{Hello World}')).toBe('<h1>Hello World</h1>');
  });

  it('expands complex nested structure with text', () => {
    expect(expandEmmet('div.container>h1{Title}+p{Content}'))
      .toBe('<div class="container"><h1>Title</h1><p>Content</p></div>');
  });

  it('expands multiplied elements', () => {
    expect(expandEmmet('ul>li*3')).toBe('<ul><li></li><li></li><li></li></ul>');
  });

  it('expands Tailwind modifier classes using bracket attribute syntax', () => {
    expect(expandEmmet('div[class="hover:bg-blue-500"]'))
      .toBe('<div class="hover:bg-blue-500"></div>');
  });

  it('expands custom data attributes', () => {
    expect(expandEmmet('button[data-action="submit"]'))
      .toBe('<button data-action="submit"></button>');
  });

  it('handles empty string', () => {
    expect(() => expandEmmet('')).toThrow();
  });

  it('throws on invalid Emmet syntax', () => {
    expect(() => expandEmmet('div>>>')).toThrow();
  });
});
