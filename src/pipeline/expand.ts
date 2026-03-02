import emmet from 'emmet';
import type { EmmetString, HTMLString, PipelineStage } from '../types';

/**
 * Expands Emmet abbreviation to HTML string.
 *
 * @param abbreviation - Valid Emmet abbreviation
 * @returns Expanded HTML string
 * @throws Error if abbreviation is empty or invalid
 *
 * @example
 * expandEmmet('div.card>p{Hello}')
 * // => '<div class="card"><p>Hello</p></div>'
 */
export const expandEmmet: PipelineStage<EmmetString, HTMLString> = (
  abbreviation: EmmetString
): HTMLString => {
  if (!abbreviation || abbreviation.trim() === '') {
    throw new Error('Emmet abbreviation cannot be empty');
  }

  try {
    const html = emmet(abbreviation);
    // Remove formatting (newlines and tabs) to get compact HTML
    const compact = html.replace(/\n\t*/g, '');
    return compact as HTMLString;
  } catch (error) {
    throw new Error(
      `Failed to expand Emmet abbreviation: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
