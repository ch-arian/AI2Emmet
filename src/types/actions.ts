/**
 * Action system type definitions for data-action and data-payload attributes.
 *
 * This module provides type-safe foundation for interactive UI through action handling:
 * - Action names as strings (data-action="submit")
 * - Typed or unknown payloads (data-payload='{"id":1}')
 * - Error representation for invalid JSON
 * - ActionHandler callback signature with event access
 */

/**
 * Action name as a string.
 *
 * Represents the value of a data-action attribute.
 * Users can extend with string literals or discriminated unions for type safety.
 *
 * @example
 * ```tsx
 * <button data-action="submit">Submit</button>
 * ```
 */
export type Action = string;

/**
 * Action payload with support for typed, error, or undefined states.
 *
 * Generic T defaults to unknown for flexibility.
 * - T: Parsed JSON payload (when valid)
 * - Error: Result of invalid JSON.parse (per CONTEXT.md decision)
 * - undefined: No payload provided (data-payload attribute missing)
 *
 * @example
 * ```tsx
 * // Valid JSON payload
 * <button data-action="submit" data-payload='{"id":1}'>Submit</button>
 * // Payload will be {id: 1}
 *
 * // No payload
 * <button data-action="refresh">Refresh</button>
 * // Payload will be undefined
 *
 * // Invalid JSON
 * <button data-action="submit" data-payload='invalid'>Submit</button>
 * // Payload will be Error instance
 * ```
 */
export type ActionPayload<T = unknown> = T | Error | undefined;

/**
 * Action handler callback function signature.
 *
 * Called when user clicks an element with data-action attribute.
 * Receives action name, parsed payload (or Error/undefined), and native MouseEvent.
 *
 * Generic T allows typed payloads for advanced users.
 * Event parameter enables stopPropagation/preventDefault (per RESEARCH.md).
 *
 * @param action - Action name from data-action attribute
 * @param payload - Parsed JSON payload, Error (if invalid JSON), or undefined
 * @param event - Native MouseEvent for propagation control
 *
 * @example
 * ```tsx
 * const handleAction: ActionHandler = (action, payload, event) => {
 *   if (payload instanceof Error) {
 *     console.error('Invalid JSON:', payload.message);
 *     return;
 *   }
 *
 *   if (action === 'submit') {
 *     console.log('Submit:', payload);
 *     event.stopPropagation(); // Prevent parent actions
 *   }
 * };
 * ```
 */
export type ActionHandler<T = unknown> = (
  action: Action,
  payload: ActionPayload<T>,
  event: MouseEvent
) => void;

/**
 * Props interface for components that accept action handlers.
 *
 * Provides onAction callback for action delegation and optional onActionError
 * for centralized error handling (per CONTEXT.md decision).
 *
 * Generic T allows typed payloads for advanced users.
 *
 * @example
 * ```tsx
 * interface MyComponentProps extends ActionHandlerProps {
 *   children: ReactNode;
 * }
 *
 * function MyComponent({ onAction, onActionError, children }: MyComponentProps) {
 *   // Implement action delegation
 *   return <div onClick={...}>{children}</div>;
 * }
 * ```
 */
export interface ActionHandlerProps<T = unknown> {
  /**
   * Callback fired when user clicks element with data-action attribute.
   */
  onAction: ActionHandler<T>;

  /**
   * Optional callback for centralized error handling.
   * Called when onAction callback throws an exception.
   *
   * @param error - The error thrown by onAction
   * @param action - The action name that caused the error
   */
  onActionError?: (error: Error, action: Action) => void;
}
