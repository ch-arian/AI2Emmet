import { useEffect } from 'react';
import { useEmmetRenderer } from './useEmmetRenderer';
import { ErrorFallback } from './ErrorFallback';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { EmmetRendererProps } from './types';

/**
 * Main public component for rendering Emmet strings to React elements.
 *
 * Wraps useEmmetRenderer hook with built-in loading and error states.
 * Provides the primary declarative API for the library.
 *
 * @param props - Component props
 * @param props.emmet - Emmet abbreviation to render
 * @param props.onAction - Optional action handler callback
 * @param props.registry - Optional custom component registry
 * @param props.className - Applies to wrapper div
 * @param props.isLoading - Shows loading skeleton when true
 * @param props.onError - Called when parse error occurs
 *
 * @example
 * ```tsx
 * <EmmetRenderer
 *   emmet="div.card>h1{Hello}+btn{Click}"
 *   onAction={(action) => console.log(action)}
 *   className="my-container"
 * />
 * ```
 */
export function EmmetRenderer({
  emmet,
  onAction,
  registry,
  className,
  isLoading,
  onError
}: EmmetRendererProps) {
  const { element, error, isLoading: hookLoading, retry, containerRef } = useEmmetRenderer(emmet, {
    registry,
    onAction,
    isLoading
  });

  // Call onError callback when error occurs
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Show loading skeleton
  if (hookLoading) {
    return <LoadingSkeleton />;
  }

  // Show error with retry
  if (error) {
    return <ErrorFallback error={error} onRetry={retry} />;
  }

  // Render result in wrapper div (attach ref for action delegation)
  return (
    <div ref={containerRef} className={className}>
      {element}
    </div>
  );
}
