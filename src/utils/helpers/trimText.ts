/**
 * Trims text in the middle and adds ellipsis if it exceeds the maximum length.
 */
export const trimText = (text: string, maxLength = 40): string | undefined => {
  if (!text) return;

  if (text.length <= maxLength) {
    return text;
  }

  const mid = Math.floor(maxLength / 2);
  const start = text.slice(0, mid - 1);
  const end = text.slice(text.length - mid + 2);

  return `${start}...${end}`;
};

/**
 * Trims whitespaces and extra spaces in a given text.
 */
export const trimExtraSpaces = (text: string): string | undefined => {
  if (!text) return;

  // Remove leading and trailing whitespaces
  const trimmedText = text.trim();

  // Replace multiple consecutive spaces with a single space
  const normalizedText = trimmedText.replace(/\s+/g, ' ');

  return normalizedText;
};
