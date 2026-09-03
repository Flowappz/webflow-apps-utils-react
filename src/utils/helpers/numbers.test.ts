import { adjustValueToStep, getDecimalPrecision, normalizeNumber, parseNumericAttribute } from './numbers';

describe('normalizeNumber', () => {
  it('parses a plain numeric string', () => {
    expect(normalizeNumber('42')).toBe(42);
  });

  it('strips invalid symbols', () => {
    expect(normalizeNumber('$1,234.5')).toBe(1234.5);
  });

  it('returns undefined for empty input', () => {
    expect(normalizeNumber('')).toBeUndefined();
  });
});

describe('parseNumericAttribute', () => {
  it('parses valid numeric strings', () => {
    expect(parseNumericAttribute('12')).toBe(12);
    expect(parseNumericAttribute('1.5')).toBe(1.5);
  });

  it('returns the fallback for nullish values', () => {
    expect(parseNumericAttribute(null, 7)).toBe(7);
    expect(parseNumericAttribute(undefined, 7)).toBe(7);
  });

  it('returns the fallback for non-numeric strings', () => {
    expect(parseNumericAttribute('abc', 3)).toBe(3);
  });

  it('returns null when no fallback is provided and the value is invalid', () => {
    expect(parseNumericAttribute('abc')).toBeNull();
    expect(parseNumericAttribute(null)).toBeNull();
  });
});

describe('getDecimalPrecision', () => {
  it('returns 0 for integers', () => {
    expect(getDecimalPrecision(10)).toBe(0);
  });

  it('returns the number of decimal places', () => {
    expect(getDecimalPrecision(1.5)).toBe(1);
    expect(getDecimalPrecision(1.25)).toBe(2);
    expect(getDecimalPrecision(0.001)).toBe(3);
  });

  it('returns 0 for non-finite values', () => {
    expect(getDecimalPrecision(Infinity)).toBe(0);
    expect(getDecimalPrecision(NaN)).toBe(0);
  });
});

describe('adjustValueToStep', () => {
  it('snaps values down when below the half-step', () => {
    expect(adjustValueToStep(7, 5)).toBe(5);
  });

  it('snaps values up when above the half-step', () => {
    expect(adjustValueToStep(8, 5)).toBe(10);
  });

  it('keeps values already aligned with the step', () => {
    expect(adjustValueToStep(10, 5)).toBe(10);
  });

  it('respects decimal steps', () => {
    expect(adjustValueToStep(0.32, 0.25)).toBe(0.25);
    expect(adjustValueToStep(0.4, 0.25)).toBe(0.5);
  });
});
