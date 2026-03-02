import { useState, useMemo, useCallback, useRef } from 'react';
import { pipeline } from '../../pipeline';
import { useActionHandler } from '../../actions/useActionHandler';
import type { ActionHandler } from '../../types/actions';
import type { UseEmmetRendererOptions, UseEmmetRendererResult } from './types';

/**
 * Headless hook for transforming Emmet strings to React elements.
 *
 * Provides full state management including error handling, retry mechanism,
 * and action delegation. Can be used standalone or wrapped by EmmetRenderer component.
 *
 * @param emmet - Emmet abbreviation string (or undefined during loading)
 * @param options - Optional configuration (registry, onAction, isLoading)
 * @returns Object with element, error, isLoading, retry, and containerRef
 *
 * @example
 * ```tsx
 * const { element, error, retry, containerRef } = useEmmetRenderer(
 *   'div.card>h1{Hello}',
 *   { onAction: handleAction }
 * );
 *
 * if (error) return <ErrorUI onRetry={retry} />;
 * return <div ref={containerRef}>{element}</div>;
 * ```
 */
export function useEmmetRenderer(
  emmet: string | undefined,
  options?: UseEmmetRendererOptions
): UseEmmetRendererResult {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stable callback ref to avoid stale closures
  const onActionRef = useRef(options?.onAction);
  onActionRef.current = options?.onAction;

  // Stable wrapper for useActionHandler
  const stableOnAction = useCallback<ActionHandler>((action, payload, event) => {
    onActionRef.current?.(action, payload, event);
  }, []);

  // Wire up action handler
  useActionHandler(containerRef, stableOnAction);

  // Memoize pipeline execution (expensive operation)
  const element = useMemo(() => {
    // Handle empty emmet - return null (not error)
    if (!emmet || emmet === '') {
      setError(null);
      return null;
    }

    try {
      setError(null);
      return pipeline(emmet, {
        registry: options?.registry,
        onAction: stableOnAction
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    }
  }, [emmet, options?.registry, stableOnAction, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    element,
    error,
    isLoading: options?.isLoading ?? false,
    retry,
    containerRef
  };
}
