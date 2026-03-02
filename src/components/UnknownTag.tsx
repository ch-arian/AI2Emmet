import { type ReactNode, useEffect } from 'react';

/**
 * Props for UnknownTag error placeholder component.
 */
export interface UnknownTagProps {
  /** The tag name that was not recognized */
  tagName: string;
  /** Optional attributes that were attempted to be passed */
  attributes?: Record<string, string>;
  /** Children content to render inside the placeholder */
  children?: ReactNode;
}

/**
 * UnknownTag component for graceful error handling when LLM hallucinates non-existent tags.
 *
 * Behavior:
 * - Logs console.warn on every render with tag name
 * - Renders visible error placeholder (not silent failure)
 * - Shows tag name and debug info in development mode
 * - Shows minimal info in production mode
 *
 * @example
 * ```tsx
 * <UnknownTag tagName="nonexistent" attributes={{ class: "foo" }}>
 *   Content
 * </UnknownTag>
 * ```
 */
export function UnknownTag({ tagName, attributes, children }: UnknownTagProps) {
  // Log warning on every render
  useEffect(() => {
    console.warn(`Unknown tag: <${tagName}>`);
  });

  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div className="border-2 border-dashed border-red-300 bg-red-50 p-2">
      <div className="font-mono text-sm text-red-700">
        {isDev ? (
          <>
            <strong>Unknown tag:</strong> &lt;{tagName}&gt;
            {attributes && Object.keys(attributes).length > 0 && (
              <div className="mt-1 text-xs text-red-600">
                Attributes: {JSON.stringify(attributes, null, 2)}
              </div>
            )}
          </>
        ) : (
          <>Unknown: &lt;{tagName}&gt;</>
        )}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
