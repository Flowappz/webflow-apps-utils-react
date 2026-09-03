import {
  getLocalStorage,
  getSessionStorage,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  removeLocalStorage,
  removeSessionStorage,
  setLocalStorage,
  setSessionStorage
} from './index';

describe('localStorage utils', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('reports availability in jsdom', () => {
    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('sets and gets a value', () => {
    expect(setLocalStorage('key', 'value')).toBe(true);
    expect(getLocalStorage('key')).toBe('value');
  });

  it('returns null for missing keys', () => {
    expect(getLocalStorage('missing')).toBeNull();
  });

  it('removes a value', () => {
    setLocalStorage('key', 'value');

    expect(removeLocalStorage('key')).toBe(true);
    expect(getLocalStorage('key')).toBeNull();
  });

  it('does not leave the availability test key behind', () => {
    isLocalStorageAvailable();
    expect(localStorage.getItem('__localStorage_test__')).toBeNull();
  });
});

describe('sessionStorage utils', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('reports availability in jsdom', () => {
    expect(isSessionStorageAvailable()).toBe(true);
  });

  it('sets and gets a value', () => {
    expect(setSessionStorage('key', 'value')).toBe(true);
    expect(getSessionStorage('key')).toBe('value');
  });

  it('returns null for missing keys', () => {
    expect(getSessionStorage('missing')).toBeNull();
  });

  it('removes a value', () => {
    setSessionStorage('key', 'value');

    expect(removeSessionStorage('key')).toBe(true);
    expect(getSessionStorage('key')).toBeNull();
  });
});
