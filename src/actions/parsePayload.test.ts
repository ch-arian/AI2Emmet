import { describe, it, expect } from 'vitest';
import { parsePayload } from './parsePayload';

describe('parsePayload', () => {
  describe('valid JSON', () => {
    it('returns parsed object for valid JSON object', () => {
      const result = parsePayload('{"id":1}');
      expect(result).toEqual({ id: 1 });
    });

    it('returns parsed array for valid JSON array', () => {
      const result = parsePayload('[1,2,3]');
      expect(result).toEqual([1, 2, 3]);
    });

    it('returns parsed primitive for valid JSON string', () => {
      const result = parsePayload('"hello"');
      expect(result).toBe('hello');
    });

    it('returns parsed primitive for valid JSON number', () => {
      const result = parsePayload('42');
      expect(result).toBe(42);
    });

    it('returns parsed primitive for valid JSON boolean', () => {
      const result = parsePayload('true');
      expect(result).toBe(true);
    });

    it('returns null for valid JSON null', () => {
      const result = parsePayload('null');
      expect(result).toBeNull();
    });
  });

  describe('invalid JSON', () => {
    it('returns Error object for invalid JSON', () => {
      const result = parsePayload('invalid');
      expect(result).toBeInstanceOf(Error);
    });

    it('error message contains original string for debugging', () => {
      const result = parsePayload('bad json');
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error) {
        expect(result.message).toContain('bad json');
      }
    });

    it('returns Error for malformed JSON object', () => {
      const result = parsePayload('{invalid}');
      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('null/empty input', () => {
    it('returns undefined for null input', () => {
      const result = parsePayload(null);
      expect(result).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const result = parsePayload('');
      expect(result).toBeUndefined();
    });
  });
});
