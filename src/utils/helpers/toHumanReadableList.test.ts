import { toHumanReadableList } from './toHumanReadableList';

describe('toHumanReadableList', () => {
  it('returns an empty string for an empty array', () => {
    expect(toHumanReadableList([])).toBe('');
  });

  it('returns the single item for a one-element array', () => {
    expect(toHumanReadableList(['apples'])).toBe('apples');
  });

  it('joins two items with the conjunction', () => {
    expect(toHumanReadableList(['apples', 'pears'])).toBe('apples and pears');
  });

  it('joins many items with commas and the conjunction', () => {
    expect(toHumanReadableList(['a', 'b', 'c'])).toBe('a, b and c');
  });

  it('supports a custom conjunction', () => {
    expect(toHumanReadableList(['a', 'b', 'c'], 'or')).toBe('a, b or c');
  });
});
