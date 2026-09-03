import { capitalizeFirstLetter } from './capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
  it('capitalizes a single word', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('capitalizes each comma-separated word and adds a space after commas', () => {
    expect(capitalizeFirstLetter('foo,bar,baz')).toBe('Foo, Bar, Baz');
  });

  it('keeps already-capitalized words intact', () => {
    expect(capitalizeFirstLetter('Foo,Bar')).toBe('Foo, Bar');
  });

  it('returns an empty string for an empty input', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });
});
