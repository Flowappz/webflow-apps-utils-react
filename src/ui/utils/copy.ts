import copy from 'copy-text-to-clipboard';

/**
 * Copies the provided text to the clipboard.
 */
export const copyText = (text: string): boolean => {
  return copy(text);
};
