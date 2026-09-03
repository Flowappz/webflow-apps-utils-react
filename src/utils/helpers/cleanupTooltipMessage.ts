/**
 * Handles fullstop placement at the end of tooltip messages.
 */
export const cleanupTooltipMessage = (message: string): string => {
  if (!message?.trim()) return message;

  const trimmed = message.trim();
  if (!trimmed) return message;

  // Check if there's any period anywhere in the text
  const hasPeriod = trimmed.includes('.');

  if (hasPeriod) {
    // If there's a period somewhere, ensure it ends with a period
    if (!trimmed.endsWith('.')) {
      return trimmed + '.';
    }
    return trimmed;
  }

  // If there's no period anywhere, remove any trailing period
  if (trimmed.endsWith('.')) {
    return trimmed.slice(0, -1);
  }

  return trimmed;
};
