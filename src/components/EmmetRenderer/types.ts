import type { ComponentRegistry } from '../../registry/ComponentRegistry';
import type { ActionHandler } from '../../types/actions';
import type { PipelineResult } from '../../types/pipeline';

/**
 * Options for useEmmetRenderer hook.
 */
export interface UseEmmetRendererOptions {
  /** Optional custom component registry */
  registry?: ComponentRegistry;
  /** Optional action handler callback */
  onAction?: ActionHandler;
  /** User-controlled loading state (for async LLM calls) */
  isLoading?: boolean;
}

/**
 * Result returned by useEmmetRenderer hook.
 */
export interface UseEmmetRendererResult {
  /** Rendered React element or null */
  element: PipelineResult | null;
  /** Parse error or null */
  error: Error | null;
  /** Passthrough from options */
  isLoading: boolean;
  /** Triggers re-parse */
  retry: () => void;
  /** Container ref for action delegation */
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Props for EmmetRenderer component (Plan 04-02 will use these).
 */
export interface EmmetRendererProps {
  /** Emmet abbreviation (can be undefined during loading) */
  emmet: string | undefined;
  /** Optional action callback */
  onAction?: ActionHandler;
  /** Optional custom registry */
  registry?: ComponentRegistry;
  /** Applies to wrapper div */
  className?: string;
  /** Shows skeleton when true */
  isLoading?: boolean;
  /** Called when parse fails (for analytics) */
  onError?: (error: Error) => void;
}
