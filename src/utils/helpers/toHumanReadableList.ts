/**
 * Converts an array of strings into a human-readable list by adding commas and "and" before the last item.
 */
export const toHumanReadableList = (arr: string[], conjunction = 'and'): string => {
  const len = arr.length;
  if (len === 0) return '';
  if (len === 1) return arr[0];
  return `${arr.slice(0, -1).join(', ')} ${conjunction} ${arr[len - 1]}`;
};
