import { get } from '../../ui/stores/store';
import { isPreviewMode } from './isPreviewMode';
import { routerStore } from './router';

describe('isPreviewMode store', () => {
  afterEach(() => {
    isPreviewMode.set(false);
  });

  it('defaults to false', () => {
    expect(get(isPreviewMode)).toBe(false);
  });

  it('supports set and notifies subscribers', () => {
    const values: boolean[] = [];
    const unsubscribe = isPreviewMode.subscribe((value) => values.push(value));

    isPreviewMode.set(true);

    expect(values).toEqual([false, true]);
    expect(get(isPreviewMode)).toBe(true);

    unsubscribe();

    isPreviewMode.set(false);
    expect(values).toEqual([false, true]);
  });

  it('supports update', () => {
    isPreviewMode.update((value) => !value);
    expect(get(isPreviewMode)).toBe(true);
  });
});

describe('routerStore', () => {
  it('initializes with an empty hash and the current URL', () => {
    const { hash, url } = get(routerStore);

    expect(hash).toBe('');
    expect(url).toBeInstanceOf(URL);
    expect(url?.href).toBe(window.location.href);
  });

  it('is writable', () => {
    const initial = get(routerStore);

    const newValue = { hash: '#section', url: new URL('https://example.com/page') };
    routerStore.set(newValue);

    expect(get(routerStore)).toEqual(newValue);

    routerStore.set(initial);
  });
});
