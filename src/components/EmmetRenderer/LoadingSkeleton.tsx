/**
 * Skeleton loading placeholder with pulse animation.
 * Shows animated gray boxes while content is loading.
 */
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3" data-testid="loading-skeleton">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
  );
}
