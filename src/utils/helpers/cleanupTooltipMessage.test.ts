import { cleanupTooltipMessage } from './cleanupTooltipMessage';

describe('cleanupTooltipMessage', () => {
  it('returns the message untouched when empty or whitespace-only', () => {
    expect(cleanupTooltipMessage('')).toBe('');
    expect(cleanupTooltipMessage('   ')).toBe('   ');
  });

  it('appends a period when the text contains a period but does not end with one', () => {
    expect(cleanupTooltipMessage('First sentence. Second sentence')).toBe('First sentence. Second sentence.');
  });

  it('keeps the trailing period when the text contains periods and already ends with one', () => {
    expect(cleanupTooltipMessage('First. Second.')).toBe('First. Second.');
  });

  it('trims surrounding whitespace', () => {
    expect(cleanupTooltipMessage('  Hello there  ')).toBe('Hello there');
  });

  it('returns a period-free message untouched', () => {
    expect(cleanupTooltipMessage('No periods here')).toBe('No periods here');
  });
});
