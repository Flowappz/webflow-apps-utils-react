import {
  getObjectEntries,
  getObjectKeys,
  isBoolean,
  isElement,
  isFile,
  isFormField,
  isHTMLAnchorElement,
  isHTMLButtonElement,
  isHTMLElement,
  isHTMLImageElement,
  isHTMLInputElement,
  isHTMLOptionElement,
  isHTMLSelectElement,
  isHTMLTextAreaElement,
  isKeyOf,
  isNotEmpty,
  isNumber,
  isString,
  isUndefined
} from './guards';

describe('primitive guards', () => {
  it('isString', () => {
    expect(isString('a')).toBe(true);
    expect(isString(1)).toBe(false);
  });

  it('isNumber', () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber('1')).toBe(false);
  });

  it('isBoolean', () => {
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(0)).toBe(false);
  });

  it('isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
  });

  it('isNotEmpty', () => {
    expect(isNotEmpty(0)).toBe(true);
    expect(isNotEmpty('')).toBe(true);
    expect(isNotEmpty(null)).toBe(false);
    expect(isNotEmpty(undefined)).toBe(false);

    const items = [1, null, 4, undefined, 8];
    expect(items.filter(isNotEmpty)).toEqual([1, 4, 8]);
  });

  it('isKeyOf', () => {
    const source = ['a', 'b'] as const;
    expect(isKeyOf('a', source)).toBe(true);
    expect(isKeyOf('c', source)).toBe(false);
    expect(isKeyOf(null, source)).toBe(false);
    expect(isKeyOf(undefined, source)).toBe(false);
  });
});

describe('object helpers', () => {
  it('getObjectKeys', () => {
    expect(getObjectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  it('getObjectEntries', () => {
    expect(getObjectEntries({ a: 1, b: 2 })).toEqual([
      ['a', 1],
      ['b', 2]
    ]);
  });
});

describe('DOM guards', () => {
  it('detects element types', () => {
    const div = document.createElement('div');
    const input = document.createElement('input');
    const select = document.createElement('select');
    const textarea = document.createElement('textarea');
    const anchor = document.createElement('a');
    const option = document.createElement('option');
    const img = document.createElement('img');
    const button = document.createElement('button');

    expect(isElement(div)).toBe(true);
    expect(isElement('div')).toBe(false);

    expect(isHTMLElement(div)).toBe(true);
    expect(isHTMLElement(document.createTextNode('x'))).toBe(false);

    expect(isHTMLInputElement(input)).toBe(true);
    expect(isHTMLInputElement(div)).toBe(false);

    expect(isHTMLSelectElement(select)).toBe(true);
    expect(isHTMLTextAreaElement(textarea)).toBe(true);
    expect(isHTMLAnchorElement(anchor)).toBe(true);
    expect(isHTMLOptionElement(option)).toBe(true);
    expect(isHTMLImageElement(img)).toBe(true);
    expect(isHTMLButtonElement(button)).toBe(true);
  });

  it('isFormField accepts inputs, selects and textareas only', () => {
    expect(isFormField(document.createElement('input'))).toBe(true);
    expect(isFormField(document.createElement('select'))).toBe(true);
    expect(isFormField(document.createElement('textarea'))).toBe(true);
    expect(isFormField(document.createElement('div'))).toBe(false);
    expect(isFormField(null)).toBe(false);
  });

  it('isFile', () => {
    expect(isFile(new File(['content'], 'file.txt'))).toBe(true);
    expect(isFile('file.txt')).toBe(false);
  });
});
