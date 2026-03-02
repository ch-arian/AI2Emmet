import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for Text components (Heading, Paragraph, Span).
 */
export type TextProps<T extends 'h1' | 'p' | 'span'> = ComponentPropsWithoutRef<T>;

/**
 * Heading component - maps from h1 tag in Emmet abbreviations.
 *
 * Default styles: Large semibold text with bottom margin.
 * User className merges with defaults via tailwind-merge.
 *
 * @example
 * ```tsx
 * <Heading>Welcome</Heading>
 * <Heading className="text-4xl">Large Heading</Heading>
 * ```
 */
export function Heading({ className, children, ...props }: TextProps<'h1'>) {
  return (
    <h1
      className={twMerge('text-2xl font-semibold text-slate-900 mb-2', className)}
      {...props}
    >
      {children}
    </h1>
  );
}

/**
 * Paragraph component - maps from p tag in Emmet abbreviations.
 *
 * Default styles: Base text with relaxed line height and bottom margin.
 * User className merges with defaults via tailwind-merge.
 *
 * @example
 * ```tsx
 * <Paragraph>Some text content.</Paragraph>
 * <Paragraph className="text-lg">Larger paragraph.</Paragraph>
 * ```
 */
export function Paragraph({ className, children, ...props }: TextProps<'p'>) {
  return (
    <p
      className={twMerge('text-base text-slate-700 leading-relaxed mb-4', className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Span component - maps from span tag in Emmet abbreviations.
 *
 * Default styles: None (inherits parent styles).
 * User className applied directly via tailwind-merge.
 *
 * @example
 * ```tsx
 * <Span>Inline text</Span>
 * <Span className="font-bold">Bold text</Span>
 * ```
 */
export function Span({ className, children, ...props }: TextProps<'span'>) {
  return (
    <span className={twMerge(className)} {...props}>
      {children}
    </span>
  );
}
