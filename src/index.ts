/**
 * Emmet UI - React library for LLM-generated interfaces
 *
 * Renders UI from Emmet abbreviations with ~60% fewer tokens than JSON.
 */

// Main pipeline function
export { pipeline } from './pipeline';

// Stage functions for advanced usage
export { expandEmmet, sanitizeHTML, hydrateToReact, createHydrateOptions } from './pipeline';

// Registry
export {
  ComponentRegistry,
  defaultRegistry,
  createDefaultRegistry,
  createReplaceCallback,
  RegistryProvider,
  useRegistry
} from './registry';

// Actions
export { parsePayload, useActionHandler } from './actions';

// Components
export {
  Button,
  Card,
  Container,
  Heading,
  Paragraph,
  Span,
  UnknownTag,
  // Phase 4: EmmetRenderer
  EmmetRenderer,
  useEmmetRenderer,
  ErrorFallback,
  LoadingSkeleton
} from './components';

// Types
export type {
  EmmetString,
  HTMLString,
  SafeHTMLString,
  PipelineOptions,
  PipelineResult,
  ReplaceCallback,
} from './pipeline';

export type {
  ComponentMap,
  ComponentEntry,
  RegistryOptions,
  RegistryProviderProps
} from './registry';

export type {
  ButtonProps,
  CardProps,
  ContainerProps,
  TextProps,
  UnknownTagProps,
  EmmetRendererProps,
  UseEmmetRendererOptions,
  UseEmmetRendererResult
} from './components';

export type {
  Action,
  ActionPayload,
  ActionHandler,
  ActionHandlerProps
} from './types';
