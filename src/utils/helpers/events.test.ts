import { addListener, simulateEvent } from './events';

describe('addListener', () => {
  it('adds a listener and returns a callback that removes it', () => {
    const element = document.createElement('button');
    const listener = vi.fn();

    const removeListener = addListener(element, 'click', listener);

    element.click();
    expect(listener).toHaveBeenCalledTimes(1);

    removeListener();

    element.click();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('returns a noop for null/undefined targets', () => {
    expect(() => addListener(null, 'click', vi.fn())()).not.toThrow();
    expect(() => addListener(undefined, 'click', vi.fn())()).not.toThrow();
  });
});

describe('simulateEvent', () => {
  it('dispatches a single bubbling event', () => {
    const parent = document.createElement('div');
    const child = document.createElement('input');
    parent.appendChild(child);

    const parentListener = vi.fn();
    parent.addEventListener('input', parentListener);

    const result = simulateEvent(child, 'input');

    expect(result).toBe(true);
    expect(parentListener).toHaveBeenCalledTimes(1);
  });

  it('dispatches multiple events', () => {
    const element = document.createElement('input');

    const inputListener = vi.fn();
    const changeListener = vi.fn();
    element.addEventListener('input', inputListener);
    element.addEventListener('change', changeListener);

    const result = simulateEvent(element, ['input', 'change']);

    expect(result).toBe(true);
    expect(inputListener).toHaveBeenCalledTimes(1);
    expect(changeListener).toHaveBeenCalledTimes(1);
  });
});
