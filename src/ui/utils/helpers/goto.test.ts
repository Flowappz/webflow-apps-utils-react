import { beforeEach, describe, expect, it, vi } from 'vitest';

import { get, writable } from '../../stores/store';

const { routerStore } = vi.hoisted(() => {
  // Minimal inline writable to avoid importing app code inside the hoisted block
  type State = { hash: string; url: URL | null };
  let value: State = { hash: '', url: null };
  const subscribers = new Set<(v: State) => void>();
  return {
    routerStore: {
      subscribe(run: (v: State) => void) {
        subscribers.add(run);
        run(value);
        return () => subscribers.delete(run);
      },
      set(v: State) {
        value = v;
        subscribers.forEach((run) => run(value));
      },
      update(fn: (v: State) => State) {
        this.set(fn(value));
      },
    },
  };
});

vi.mock('../../../utils/stores', () => ({ routerStore }));

import { goto } from './goto';

describe('goto', () => {
  beforeEach(() => {
    routerStore.set({ hash: '', url: null });
    vi.restoreAllMocks();
  });

  it('logs an error and does nothing when the router store has no hash', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const pushSpy = vi.spyOn(window.history, 'pushState');

    goto('/settings');

    expect(errorSpy).toHaveBeenCalledWith(
      'goto method found no router hash in the router store. Contact Finsweet support.'
    );
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('navigates via the History API and updates the router store url', () => {
    routerStore.set({ hash: 'app', url: null });
    const pushSpy = vi.spyOn(window.history, 'pushState');

    goto('settings', { from: 'test' });

    expect(pushSpy).toHaveBeenCalledTimes(1);
    const [state, , pathname] = pushSpy.mock.calls[0];
    expect(state).toEqual({ from: 'test' });
    expect(pathname).toBe('/app/settings');

    const { url } = get(routerStore as never) as { url: URL | null };
    expect(url?.pathname).toBe('/app/settings');
  });

  it('sanity: local writable helper matches store API', () => {
    const store = writable(1);
    store.update((v) => v + 1);
    expect(get(store)).toBe(2);
  });
});
