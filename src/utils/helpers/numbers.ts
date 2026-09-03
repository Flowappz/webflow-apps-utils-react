/**
 * Converts a string to a number, removing invalid symbols.
 */
export const normalizeNumber = (value: string): number | undefined => {
  if (!value) return;

  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
};

/**
 * Parses a numeric attribute string with fallback support.
 */
export function parseNumericAttribute(rawValue: string | number | null | undefined, fallback: number): number;
export function parseNumericAttribute(
  rawValue: string | number | null | undefined,
  fallback?: number | null
): number | null;
export function parseNumericAttribute(
  rawValue: string | number | null | undefined,
  fallback?: number | null
): number | null {
  if (!rawValue) return fallback ?? null;

  const value = Number(rawValue);
  if (!isNaN(value)) return value;

  if (fallback) return fallback;

  return null;
}

/**
 * Calculates the number of decimal places in a float.
 */
export const getDecimalPrecision = (value: number): number => {
  if (!isFinite(value)) return 0;

  let exponential = 1;
  let precision = 0;

  while (Math.round(value * exponential) / exponential !== value) {
    exponential *= 10;
    precision += 1;
  }

  return precision;
};

/**
 * Ensures a specific decimal precision on a number.
 */
const setDecimalPrecision = (value: number, precision: number) => {
  const pow = Math.pow(10, precision);
  return Math.round(value * pow) / pow;
};

/**
 * Adjusts a numeric value to align with a step factor.
 */
export const adjustValueToStep = (value: number, step: number, precision?: number, minRange = 0): number => {
  precision ??= getDecimalPrecision(step);

  const offset = minRange > 1 ? minRange % step : 0;
  const remainder = value % step;
  const floor = offset + value - remainder;

  if (remainder > step / 2) return setDecimalPrecision(floor + step, precision);

  return setDecimalPrecision(floor, precision);
};
