import { describe, expect, it, vi } from 'vitest';

const { copyMock } = vi.hoisted(() => ({ copyMock: vi.fn(() => true) }));

vi.mock('copy-text-to-clipboard', () => ({ default: copyMock }));

import { copyText } from './copy';

describe('copyText', () => {
  it('delegates to copy-text-to-clipboard and returns its result', () => {
    expect(copyText('hello')).toBe(true);
    expect(copyMock).toHaveBeenCalledWith('hello');
  });
});
