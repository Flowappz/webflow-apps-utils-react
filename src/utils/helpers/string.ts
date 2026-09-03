/**
 * Removes the trailing slash from a URL string.
 *
 * @example
 * ```
 * This:
 * https://www.finsweet.com/attributes/attractions/capri-island/
 *
 * Becomes:
 * https://www.finsweet.com/attributes/attractions/capri-island
 * ```
 *
 * @param value The value to mutate.
 * @returns A new string without a trailing slash.
 */
export const removeTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

/**
 * Convert a string of comma separated values to an array of values.
 *
 * @param string Comma separated string.
 * @param filterEmpty Defines if empty values should be filtered out of the returned array. Defaults to `true`.
 */
export const extractCommaSeparatedValues = (string: string | null | undefined, filterEmpty = true): string[] => {
  if (!string) return [];

  const items = string.split(',').reduce<string[]>((accumulatedValue, currentValue) => {
    const value = currentValue.trim();

    if (!filterEmpty || value) accumulatedValue.push(value);

    return accumulatedValue;
  }, []);

  return items;
};
