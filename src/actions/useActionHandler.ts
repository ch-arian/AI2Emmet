import { useEffect, useRef } from 'react';
import type { ActionHandler } from '../types/actions';
import { parsePayload } from './parsePayload';

/**
 * Hook that attaches event delegation for data-action attributes.
 * Single click listener on root element handles all actions.
 *
 * @param rootRef - Ref to the container element
 * @param onAction - Callback invoked when action element clicked
 */
export function useActionHandler(
  rootRef: React.RefObject<HTMLElement | null>,
  onAction: ActionHandler
): void {
  // Stable reference to latest onAction to avoid stale closure
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleClick = (event: MouseEvent) => {
      // Find the first element with data-action, then bubble up through parents
      let currentTarget = (event.target as Element).closest('[data-action]');

      if (!currentTarget) {
        return;
      }

      // Walk up the DOM tree and call handler for each data-action element
      while (currentTarget && root.contains(currentTarget)) {
        const action = currentTarget.getAttribute('data-action');

        if (action) {
          const payloadStr = currentTarget.getAttribute('data-payload');
          const payload = parsePayload(payloadStr);

          onActionRef.current(action, payload, event);
        }

        // Move to next parent with data-action
        const parent: HTMLElement | null = currentTarget.parentElement;
        currentTarget = parent ? parent.closest('[data-action]') : null;
      }
    };

    root.addEventListener('click', handleClick);

    return () => {
      root.removeEventListener('click', handleClick);
    };
  }, [rootRef]);
}
