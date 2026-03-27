import { describe, it, expect } from 'vitest';
import { hexToRgba } from '../../src/helpers/color.helper';

describe('hexToRgba', () => {
  it('valid 6-digit hex, alpha 100', () => {
    expect(hexToRgba('#ff0000', 100)).toBe('rgba(255, 0, 0, 1)');
  });

  it('valid 6-digit hex, alpha 0', () => {
    expect(hexToRgba('#ff0000', 0)).toBe('rgba(255, 0, 0, 0)');
  });

  it('valid 6-digit hex, alpha 50', () => {
    expect(hexToRgba('#001031', 50)).toBe('rgba(0, 16, 49, 0.5)');
  });

  it('empty string → fallback', () => {
    expect(hexToRgba('', 100)).toBe('rgba(0,16,49,1)');
  });

  it('3-digit hex (#fff, length 4 < 7) → fallback', () => {
    expect(hexToRgba('#fff', 50)).toBe('rgba(0,16,49,0.5)');
  });

  it('empty string, alpha 0 → fallback', () => {
    expect(hexToRgba('', 0)).toBe('rgba(0,16,49,0)');
  });
});
