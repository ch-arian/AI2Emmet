const isDevelopment = process.env.NODE_ENV === 'development';

export interface ErrorFallbackProps {
  error: Error;
  onRetry: () => void;
}

/**
 * Error UI component with retry button.
 * Shows full error details in development, generic message in production.
 */
export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  // Log to console in both dev and prod
  console.error('EmmetRenderer error:', error);

  return (
    <div
      role="alert"
      className="border border-red-300 bg-red-50 p-4 rounded-md"
      data-testid="error-fallback"
    >
      <h3 className="text-red-800 font-semibold mb-2">Failed to render UI</h3>

      {isDevelopment ? (
        // Development: Show full error details
        <pre className="text-sm text-red-700 bg-red-100 p-2 rounded overflow-auto">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      ) : (
        // Production: Generic message
        <p className="text-red-700">
          An error occurred while rendering. Please try again.
        </p>
      )}

      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
