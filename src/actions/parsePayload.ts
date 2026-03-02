import type { ActionPayload } from '../types/actions';

/**
 * Parse JSON payload string with error passthrough.
 * Returns Error object for invalid JSON instead of throwing.
 * Returns undefined for null/empty input.
 */
export function parsePayload<T = unknown>(jsonStr: string | null): ActionPayload<T> {
  if (!jsonStr) return undefined;

  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error(`Failed to parse payload: ${jsonStr}`);
  }
}
