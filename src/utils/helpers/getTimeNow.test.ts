import { getTimeNow } from './getTimeNow';

describe('getTimeNow', () => {
  it('formats the current date as "MMMM d, yyyy, h:mma"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 3, 14, 5)); // September 3, 2026 2:05 PM

    expect(getTimeNow()).toBe('September 3, 2026, 2:05PM');

    vi.useRealTimers();
  });

  it('matches the expected pattern', () => {
    expect(getTimeNow()).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}, \d{1,2}:\d{2}(AM|PM)$/);
  });
});
