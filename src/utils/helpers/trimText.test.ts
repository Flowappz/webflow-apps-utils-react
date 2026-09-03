import { trimExtraSpaces, trimText } from './trimText';

describe('trimText', () => {
  it('returns undefined for empty input', () => {
    expect(trimText('')).toBeUndefined();
  });

  it('returns short text untouched', () => {
    expect(trimText('short text')).toBe('short text');
  });

  it('trims long text in the middle with an ellipsis', () => {
    const text = 'a'.repeat(30) + 'b'.repeat(30);
    const result = trimText(text, 40);

    expect(result).toBeDefined();
    expect(result).toContain('...');
    expect(result!.length).toBe(40);
    expect(result!.startsWith('a')).toBe(true);
    expect(result!.endsWith('b')).toBe(true);
  });
});

describe('trimExtraSpaces', () => {
  it('returns undefined for empty input', () => {
    expect(trimExtraSpaces('')).toBeUndefined();
  });

  it('trims leading/trailing whitespace and collapses inner spaces', () => {
    expect(trimExtraSpaces('  hello   big \n world  ')).toBe('hello big world');
  });
});
