import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  compareKeys,
  createDefaultConfiguratorState,
  extractKeys,
  hasChangesViaDiff,
  hasConfiguratorChanged,
  validateWatchOptions,
} from './configuratorUtils';
import { createGlobalContext } from './globalContext';

describe('createGlobalContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with initial contexts', () => {
    const ctx = createGlobalContext({ app: { title: 'Hello' } });

    expect(ctx.hasContext('app')).toBe(true);
    expect(ctx.getActiveContexts()).toEqual(['app']);
    expect(ctx.getContext<{ title: string }>('app').get()).toEqual({ title: 'Hello' });
  });

  it('set() merges with existing data', () => {
    const ctx = createGlobalContext({ user: { name: 'Ann', age: 30 } });
    const ops = ctx.getContext<{ name: string; age: number }>('user');

    ops.set({ age: 31 });

    expect(ops.get()).toEqual({ name: 'Ann', age: 31 });
  });

  it('set() creates a new context when missing', () => {
    const ctx = createGlobalContext();
    const ops = ctx.getContext<{ a: number }>('custom');

    ops.set({ a: 1 });

    expect(ctx.hasContext('custom')).toBe(true);
    expect(ops.get()).toEqual({ a: 1 });
  });

  it('update() replaces data via updater', () => {
    const ctx = createGlobalContext({ counter: { value: 1 } });
    const ops = ctx.getContext<{ value: number }>('counter');

    ops.update((current) => ({ value: (current?.value ?? 0) + 1 }));

    expect(ops.get()).toEqual({ value: 2 });
  });

  it('clear() sets data to null but keeps the context', () => {
    const ctx = createGlobalContext({ app: { title: 'x' } });
    const ops = ctx.getContext('app');

    ops.clear();

    expect(ctx.hasContext('app')).toBe(true);
    expect(ops.get()).toBeNull();
  });

  it('reset() completely removes the context', () => {
    const ctx = createGlobalContext({ app: { title: 'x' } });
    const ops = ctx.getContext('app');

    ops.reset();

    expect(ctx.hasContext('app')).toBe(false);
    expect(ops.get()).toBeUndefined();
    expect(ctx.getActiveContexts()).toEqual([]);
  });

  it('tracks metadata (version, updatedAt, isActive)', () => {
    const ctx = createGlobalContext({ app: { title: 'x' } });
    const ops = ctx.getContext<{ title: string }>('app');

    ops.set({ title: 'y' });

    const metadata = ctx.getContextMetadata('app');
    expect(metadata).not.toBeNull();
    expect(metadata?.version).toBe(2);
    expect(metadata?.isActive).toBe(true);
    expect(ctx.getContextMetadata('missing')).toBeNull();
  });

  it('getAllContexts / state return a snapshot of all data', () => {
    const ctx = createGlobalContext({ a: 1, b: 2 });

    expect(ctx.getAllContexts()).toEqual({ a: 1, b: 2 });
    expect(ctx.state).toEqual({ a: 1, b: 2 });
  });

  it('clearAll() nulls every context; resetAll() removes them', () => {
    const ctx = createGlobalContext({ a: 1, b: 2 });

    ctx.clearAll();
    expect(ctx.getAllContexts()).toEqual({ a: null, b: null });
    expect(ctx.hasContext('a')).toBe(true);

    ctx.resetAll();
    expect(ctx.getAllContexts()).toEqual({});
    expect(ctx.hasContext('a')).toBe(false);
  });

  it('removeContext() removes a single context', () => {
    const ctx = createGlobalContext({ a: 1, b: 2 });

    ctx.removeContext('a');

    expect(ctx.hasContext('a')).toBe(false);
    expect(ctx.hasContext('b')).toBe(true);
  });

  it('context subscribe() receives batched events for its key', () => {
    const ctx = createGlobalContext();
    const ops = ctx.getContext<{ v: number }>('watched');
    const other = ctx.getContext<{ v: number }>('other');

    const received: unknown[] = [];
    const unsubscribe = ops.subscribe((data) => received.push(data));

    ops.set({ v: 1 });
    other.set({ v: 99 });

    // Events are batched — nothing until the 16ms flush
    expect(received).toEqual([]);
    vi.advanceTimersByTime(20);

    expect(received).toEqual([{ v: 1 }]);

    unsubscribe();
    ops.set({ v: 2 });
    vi.advanceTimersByTime(20);
    expect(received).toEqual([{ v: 1 }]);
  });

  it('global subscribe() receives all events', () => {
    const ctx = createGlobalContext();
    const events: Array<{ type: string; contextKey?: string }> = [];
    const unsubscribe = ctx.subscribe((event) => events.push(event));

    ctx.getContext('a').set({ x: 1 });
    ctx.getContext('a').update(() => ({ x: 2 }));
    ctx.getContext('a').clear();
    ctx.getContext('a').reset();
    vi.advanceTimersByTime(20);

    expect(events.map((e) => e.type)).toEqual(['set', 'update', 'clear', 'reset']);
    expect(events[0].contextKey).toBe('a');

    unsubscribe();
  });

  it('stateStore emits reactive snapshots on mutation', () => {
    const ctx = createGlobalContext({ a: 1 });
    const snapshots: Array<Record<string, unknown>> = [];
    const unsubscribe = ctx.stateStore.subscribe((snapshot) => snapshots.push(snapshot));

    ctx.getContext('b').set({ ok: true });

    expect(snapshots[0]).toEqual({ a: 1 });
    expect(snapshots[snapshots.length - 1]).toEqual({ a: 1, b: { ok: true } });
    unsubscribe();
  });

  it('computes configurator hasChanged after debounce when app context updates', () => {
    const ctx = createGlobalContext({
      app: {
        editMode: false,
        repairMode: false,
        title: null,
        configurator: createDefaultConfiguratorState(),
      },
    });

    const appOps = ctx.getContext<Record<string, unknown>>('app');
    appOps.set({
      configurator: {
        configurator: { theme: 'dark' },
        configuratorCache: { theme: 'light' },
        hasChanged: false,
        watchOptions: { watchAll: true, watchKeys: [], debounceMs: 50 },
      },
    });

    // Debounced by 50ms
    vi.advanceTimersByTime(100);

    const data = appOps.get() as {
      configurator: { hasChanged: boolean };
    };
    expect(data.configurator.hasChanged).toBe(true);
  });
});

describe('configuratorUtils', () => {
  it('validateWatchOptions applies defaults and minimums', () => {
    expect(validateWatchOptions({})).toEqual({ watchAll: true, watchKeys: [], debounceMs: 50 });
    expect(validateWatchOptions({ debounceMs: 1 }).debounceMs).toBe(16);
    // watchAll=false with no keys falls back to watchAll=true
    expect(validateWatchOptions({ watchAll: false, watchKeys: [] }).watchAll).toBe(true);
    expect(validateWatchOptions({ watchAll: false, watchKeys: ['a'] }).watchAll).toBe(false);
  });

  it('extractKeys picks only the requested keys', () => {
    expect(extractKeys({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    expect(extractKeys(null, ['a'])).toBeNull();
    expect(extractKeys({ a: 1 }, [])).toBeNull();
  });

  it('hasChangesViaDiff detects deep changes', () => {
    expect(hasChangesViaDiff({ a: 1 }, { a: 1 })).toBe(false);
    expect(hasChangesViaDiff({ a: 1 }, { a: 2 })).toBe(true);
    expect(hasChangesViaDiff({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true);
  });

  it('hasConfiguratorChanged honours watch options', () => {
    const current = { theme: 'dark', size: 1 };
    const cache = { theme: 'light', size: 1 };

    expect(hasConfiguratorChanged(null, null, { watchAll: true })).toBe(false);
    expect(hasConfiguratorChanged(current, null, { watchAll: true })).toBe(true);
    expect(hasConfiguratorChanged(current, cache, { watchAll: true })).toBe(true);
    expect(
      hasConfiguratorChanged(current, cache, { watchAll: false, watchKeys: ['size'] })
    ).toBe(false);
    expect(
      hasConfiguratorChanged(current, cache, { watchAll: false, watchKeys: ['theme'] })
    ).toBe(true);
  });

  it('compareKeys compares only the given keys', () => {
    expect(compareKeys({ a: 1, b: 2 }, { a: 1, b: 3 }, ['a'])).toBe(true);
    expect(compareKeys({ a: 1, b: 2 }, { a: 9, b: 2 }, ['a'])).toBe(false);
    expect(compareKeys(null, null, ['a'])).toBe(true);
    expect(compareKeys({ a: 1 }, null, ['a'])).toBe(false);
  });
});
