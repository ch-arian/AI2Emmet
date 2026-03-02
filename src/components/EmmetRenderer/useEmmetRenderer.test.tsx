import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmmetRenderer } from './useEmmetRenderer';
import { ComponentRegistry } from '../../registry/ComponentRegistry';
import * as pipelineModule from '../../pipeline';

// Mock the pipeline module
vi.mock('../../pipeline', async () => {
  const actual = await vi.importActual('../../pipeline');
  return {
    ...actual,
    pipeline: vi.fn()
  };
});

describe('useEmmetRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('valid emmet', () => {
    it('returns element when valid emmet provided', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result } = renderHook(() =>
        useEmmetRenderer('div.card>h1{Hello}')
      );

      expect(result.current.element).toBe(mockElement);
      expect(result.current.error).toBeNull();
      expect(pipelineModule.pipeline).toHaveBeenCalledWith(
        'div.card>h1{Hello}',
        expect.objectContaining({})
      );
    });

    it('passes registry to pipeline', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);
      const registry = new ComponentRegistry();

      renderHook(() =>
        useEmmetRenderer('div', { registry })
      );

      expect(pipelineModule.pipeline).toHaveBeenCalledWith(
        'div',
        expect.objectContaining({ registry })
      );
    });
  });

  describe('invalid emmet', () => {
    it('returns error when pipeline throws', () => {
      const mockError = new Error('Invalid syntax');
      vi.mocked(pipelineModule.pipeline).mockImplementation(() => {
        throw mockError;
      });

      const { result } = renderHook(() =>
        useEmmetRenderer('>>>')
      );

      expect(result.current.element).toBeNull();
      expect(result.current.error).toBe(mockError);
    });

    it('wraps non-Error throws in Error object', () => {
      vi.mocked(pipelineModule.pipeline).mockImplementation(() => {
        throw 'string error';
      });

      const { result } = renderHook(() =>
        useEmmetRenderer('>>>')
      );

      expect(result.current.element).toBeNull();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('string error');
    });
  });

  describe('empty emmet', () => {
    it('returns null element for empty string', () => {
      const { result } = renderHook(() =>
        useEmmetRenderer('')
      );

      expect(result.current.element).toBeNull();
      expect(result.current.error).toBeNull();
      expect(pipelineModule.pipeline).not.toHaveBeenCalled();
    });

    it('returns null element for undefined', () => {
      const { result } = renderHook(() =>
        useEmmetRenderer(undefined)
      );

      expect(result.current.element).toBeNull();
      expect(result.current.error).toBeNull();
      expect(pipelineModule.pipeline).not.toHaveBeenCalled();
    });
  });

  describe('isLoading', () => {
    it('passes through isLoading when true', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result } = renderHook(() =>
        useEmmetRenderer('div', { isLoading: true })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('defaults isLoading to false', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result } = renderHook(() =>
        useEmmetRenderer('div')
      );

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('retry mechanism', () => {
    it('retry triggers re-parse', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result } = renderHook(() =>
        useEmmetRenderer('div')
      );

      const callCountBefore = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      act(() => {
        result.current.retry();
      });

      const callCountAfter = vi.mocked(pipelineModule.pipeline).mock.calls.length;
      expect(callCountAfter).toBeGreaterThan(callCountBefore);
    });

    it('retry clears previous error', () => {
      // First render with error
      vi.mocked(pipelineModule.pipeline).mockImplementationOnce(() => {
        throw new Error('First error');
      });

      const { result, rerender } = renderHook(() =>
        useEmmetRenderer('div')
      );

      expect(result.current.error).toBeInstanceOf(Error);

      // Mock successful parse for retry
      const mockElement = <div>Success</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      act(() => {
        result.current.retry();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.element).toBe(mockElement);
    });
  });

  describe('memoization', () => {
    it('same emmet does not re-execute pipeline', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result, rerender } = renderHook(
        ({ emmet }) => useEmmetRenderer(emmet),
        { initialProps: { emmet: 'div' } }
      );

      const firstElement = result.current.element;
      const callCountBefore = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      // Rerender with same emmet
      rerender({ emmet: 'div' });

      const callCountAfter = vi.mocked(pipelineModule.pipeline).mock.calls.length;
      const secondElement = result.current.element;

      expect(callCountAfter).toBe(callCountBefore);
      expect(Object.is(firstElement, secondElement)).toBe(true);
    });

    it('different emmet re-executes pipeline', () => {
      const mockElement1 = <div>First</div>;
      const mockElement2 = <span>Second</span>;

      vi.mocked(pipelineModule.pipeline)
        .mockReturnValueOnce(mockElement1)
        .mockReturnValueOnce(mockElement2);

      const { result, rerender } = renderHook(
        ({ emmet }) => useEmmetRenderer(emmet),
        { initialProps: { emmet: 'div' } }
      );

      const firstElement = result.current.element;
      const callCountBefore = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      // Rerender with different emmet
      rerender({ emmet: 'span' });

      const callCountAfter = vi.mocked(pipelineModule.pipeline).mock.calls.length;
      const secondElement = result.current.element;

      expect(callCountAfter).toBeGreaterThan(callCountBefore);
      expect(firstElement).not.toBe(secondElement);
    });

    it('changing registry re-executes pipeline', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const registry1 = new ComponentRegistry();
      const registry2 = new ComponentRegistry();

      const { rerender } = renderHook(
        ({ registry }) => useEmmetRenderer('div', { registry }),
        { initialProps: { registry: registry1 } }
      );

      const callCountBefore = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      // Rerender with different registry
      rerender({ registry: registry2 });

      const callCountAfter = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      expect(callCountAfter).toBeGreaterThan(callCountBefore);
    });
  });

  describe('action handler', () => {
    it('provides containerRef in result', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result } = renderHook(() =>
        useEmmetRenderer('div')
      );

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull(); // Not attached to DOM yet
    });

    it('passes onAction to pipeline via stable callback', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);
      const onAction = vi.fn();

      renderHook(() =>
        useEmmetRenderer('div', { onAction })
      );

      expect(pipelineModule.pipeline).toHaveBeenCalledWith(
        'div',
        expect.objectContaining({
          onAction: expect.any(Function)
        })
      );
    });

    it('onAction callback reference stability prevents memoization break', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const onAction1 = vi.fn();
      const onAction2 = vi.fn();

      const { rerender } = renderHook(
        ({ onAction }) => useEmmetRenderer('div', { onAction }),
        { initialProps: { onAction: onAction1 } }
      );

      const callCountBefore = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      // Rerender with different onAction callback
      rerender({ onAction: onAction2 });

      const callCountAfter = vi.mocked(pipelineModule.pipeline).mock.calls.length;

      // Stable callback reference means pipeline should NOT re-execute
      // (memoization is not broken by callback change)
      expect(callCountAfter).toBe(callCountBefore);
    });
  });

  describe('edge cases', () => {
    it('handles transition from error to valid emmet', () => {
      vi.mocked(pipelineModule.pipeline)
        .mockImplementationOnce(() => {
          throw new Error('Parse error');
        })
        .mockReturnValueOnce(<div>Valid</div>);

      const { result, rerender } = renderHook(
        ({ emmet }) => useEmmetRenderer(emmet),
        { initialProps: { emmet: '>>>' } }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.element).toBeNull();

      // Change to valid emmet
      rerender({ emmet: 'div' });

      expect(result.current.error).toBeNull();
      expect(result.current.element).toBeTruthy();
    });

    it('handles transition from valid to empty emmet', () => {
      const mockElement = <div>Test</div>;
      vi.mocked(pipelineModule.pipeline).mockReturnValue(mockElement);

      const { result, rerender } = renderHook(
        ({ emmet }) => useEmmetRenderer(emmet),
        { initialProps: { emmet: 'div' } }
      );

      expect(result.current.element).toBe(mockElement);
      expect(result.current.error).toBeNull();

      // Change to empty
      rerender({ emmet: '' });

      expect(result.current.element).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
