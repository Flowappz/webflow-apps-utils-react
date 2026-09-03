import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { colorNameToHex, normalizeHex } from './color-utils';

// jsdom's getComputedStyle reports `rgb(0, 0, 0)` for every element regardless of
// the assigned color, so emulate real browser behavior: resolve known color
// keywords to rgb, and report an empty color for unresolvable values.
const KNOWN_COLORS: Record<string, string> = {
  red: 'rgb(255, 0, 0)',
  white: 'rgb(255, 255, 255)',
};

beforeEach(() => {
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (el) =>
      ({
        color: KNOWN_COLORS[(el as HTMLElement).style.color] ?? '',
      }) as CSSStyleDeclaration
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('normalizeHex', () => {
  it('uppercases a valid 6-digit hex', () => {
    expect(normalizeHex('#ff00aa')).toBe('#FF00AA');
  });

  it('expands a 3-digit hex to 6 digits', () => {
    expect(normalizeHex('#f0a')).toBe('#FF00AA');
  });

  it('prefixes a bare hex value with #', () => {
    expect(normalizeHex('ff00aa')).toBe('#FF00AA');
  });

  it('resolves color names to hex', () => {
    expect(normalizeHex('red')).toBe('#FF0000');
  });

  it('trims whitespace', () => {
    expect(normalizeHex('  #ff00aa  ')).toBe('#FF00AA');
  });

  it('returns the original value for invalid input', () => {
    expect(normalizeHex('#xyzxyz')).toBe('#xyzxyz');
    expect(normalizeHex('not-a-color')).toBe('not-a-color');
  });
});

describe('colorNameToHex', () => {
  it('converts a color name to hex', () => {
    expect(colorNameToHex('red')).toBe('#ff0000');
  });

  it('returns null for an unresolvable value', () => {
    expect(colorNameToHex('definitely-not-a-color')).toBeNull();
  });
});
