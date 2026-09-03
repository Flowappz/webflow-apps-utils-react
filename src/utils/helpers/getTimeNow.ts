import { DateTime } from 'luxon';

/**
 * Generate a string with the current date and time in ISO format.
 */
export const getTimeNow = (): string => {
  const now = DateTime.local();
  return `${now.toFormat('MMMM d, yyyy, h:mma')}`;
};
