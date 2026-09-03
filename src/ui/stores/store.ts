/**
 * Minimal framework-agnostic store, API-compatible with `svelte/store`
 * (`writable`, `derived`, `get`, `readonly`), plus a `useStore` React hook.
 *
 * This lets the Svelte codebase's store-based modules (FormManager, siteInfo,
 * breakpoints, …) port nearly 1:1 while remaining usable outside React.
 */
import { useDebugValue, useSyncExternalStore } from 'react';

export type Subscriber<T> = (value: T) => void;
export type Unsubscriber = () => void;
export type Updater<T> = (value: T) => T;

export interface Readable<T> {
  subscribe(run: Subscriber<T>): Unsubscriber;
}

export interface Writable<T> extends Readable<T> {
  set(value: T): void;
  update(updater: Updater<T>): void;
}

export function writable<T>(initialValue: T): Writable<T> {
  let value = initialValue;
  const subscribers = new Set<Subscriber<T>>();

  return {
    subscribe(run) {
      subscribers.add(run);
      run(value);
      return () => subscribers.delete(run);
    },
    set(newValue) {
      if (Object.is(value, newValue)) return;
      value = newValue;
      for (const run of [...subscribers]) run(value);
    },
    update(updater) {
      this.set(updater(value));
    },
  };
}

export function get<T>(store: Readable<T>): T {
  let value!: T;
  store.subscribe((v) => (value = v))();
  return value;
}

type Stores = Readable<unknown> | [Readable<unknown>, ...Array<Readable<unknown>>];
type StoresValues<T> =
  T extends Readable<infer U> ? U : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

export function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>) => T): Readable<T> {
  const single = !Array.isArray(stores);
  const storeList = (single ? [stores] : stores) as Array<Readable<unknown>>;

  return {
    subscribe(run) {
      const values: unknown[] = new Array(storeList.length);
      let started = false;

      const sync = () => {
        if (!started) return;
        run(fn((single ? values[0] : values) as StoresValues<S>));
      };

      const unsubscribers = storeList.map((store, i) =>
        store.subscribe((value) => {
          values[i] = value;
          sync();
        })
      );

      started = true;
      sync();

      return () => {
        for (const unsubscribe of unsubscribers) unsubscribe();
      };
    },
  };
}

export function readonly<T>(store: Readable<T>): Readable<T> {
  return { subscribe: store.subscribe.bind(store) };
}

/** React hook: subscribe to a store and re-render on changes. */
export function useStore<T>(store: Readable<T>): T {
  const value = useSyncExternalStore(
    (onStoreChange) => store.subscribe(onStoreChange),
    () => get(store),
    () => get(store)
  );
  useDebugValue(value);
  return value;
}
