import { extractCommaSeparatedValues, removeTrailingSlash } from './string';

describe('removeTrailingSlash', () => {
  it('removes a single trailing slash', () => {
    expect(removeTrailingSlash('https://finsweet.com/page/')).toBe('https://finsweet.com/page');
  });

  it('removes multiple trailing slashes', () => {
    expect(removeTrailingSlash('https://finsweet.com///')).toBe('https://finsweet.com');
  });

  it('leaves a string without trailing slash untouched', () => {
    expect(removeTrailingSlash('https://finsweet.com')).toBe('https://finsweet.com');
  });
});

describe('extractCommaSeparatedValues', () => {
  it('splits comma separated values and trims them', () => {
    expect(extractCommaSeparatedValues(' a, b ,c ')).toEqual(['a', 'b', 'c']);
  });

  it('filters empty values by default', () => {
    expect(extractCommaSeparatedValues('a,,b,')).toEqual(['a', 'b']);
  });

  it('keeps empty values when filterEmpty is false', () => {
    expect(extractCommaSeparatedValues('a,,b', false)).toEqual(['a', '', 'b']);
  });

  it('returns an empty array for null/undefined/empty input', () => {
    expect(extractCommaSeparatedValues(null)).toEqual([]);
    expect(extractCommaSeparatedValues(undefined)).toEqual([]);
    expect(extractCommaSeparatedValues('')).toEqual([]);
  });
});
