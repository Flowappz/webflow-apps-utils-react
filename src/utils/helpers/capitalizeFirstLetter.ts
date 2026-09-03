/**
 * Capitalizes the first letter of each word in a comma-separated string and adds a space after commas.
 */
export const capitalizeFirstLetter = (input: string): string => {
  return input
    .split(',')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(', ');
};
