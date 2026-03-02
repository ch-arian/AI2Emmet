import type { ReactNode } from 'react';
import type { ActionHandler } from './actions';

// Branded string types for pipeline stages
export type EmmetString = string & { readonly __brand: 'emmet' };
export type HTMLString = string & { readonly __brand: 'html' };
export type SafeHTMLString = string & { readonly __brand: 'safeHtml' };

// Pipeline stage function type
export type PipelineStage<TIn, TOut> = (input: TIn) => TOut;

// Pipeline options (extensible for future phases)
export interface PipelineOptions {
  registry?: import('../registry/ComponentRegistry').ComponentRegistry;
  /** Action handler callback for data-action clicks (Phase 4 EmmetRenderer) */
  onAction?: ActionHandler;
}

// Pipeline result (React element or error)
export type PipelineResult = ReactNode;
