import type { WebflowCallback } from '../../types';
import { wait, waitDOMReady, waitWebflowReady } from './wait';

describe('wait', () => {
  it('resolves after the given time', async () => {
    vi.useFakeTimers();

    let resolved = false;
    const promise = wait(100).then(() => (resolved = true));

    await vi.advanceTimersByTimeAsync(99);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(resolved).toBe(true);

    vi.useRealTimers();
  });
});

describe('waitWebflowReady', () => {
  afterEach(() => {
    delete window.Webflow;
  });

  it('initializes window.Webflow as an array and pushes a resolver', async () => {
    expect(window.Webflow).toBeUndefined();

    let resolved = false;
    const promise = waitWebflowReady().then(() => (resolved = true));

    expect(Array.isArray(window.Webflow)).toBe(true);
    expect((window.Webflow as WebflowCallback[]).length).toBe(1);
    expect(resolved).toBe(false);

    // Simulate Webflow flushing the queue
    for (const callback of window.Webflow as WebflowCallback[]) callback();

    await promise;
    expect(resolved).toBe(true);
  });
});

describe('waitDOMReady', () => {
  it('resolves immediately when the document is already loaded', async () => {
    // jsdom documents report `complete` readyState by default
    await expect(waitDOMReady()).resolves.toBeUndefined();
  });
});
