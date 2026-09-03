import { describe, expect, it } from 'vitest';

import { compareObjects, deepDiffMapper, DiffType, type DiffMap, type DiffResult } from './deepDiffMapper';

const asResult = (value: DiffResult | DiffMap) => value as DiffResult;
const asMap = (value: DiffResult | DiffMap) => value as DiffMap;

describe('deepDiffMapper', () => {
  it('marks identical primitives as unchanged', () => {
    expect(asResult(deepDiffMapper.map(1, 1)).type).toBe(DiffType.UNCHANGED);
    expect(asResult(deepDiffMapper.map('a', 'a')).type).toBe(DiffType.UNCHANGED);
  });

  it('detects updated, created and deleted values', () => {
    expect(asResult(deepDiffMapper.map(1, 2)).type).toBe(DiffType.UPDATED);
    expect(asResult(deepDiffMapper.map(undefined, 2)).type).toBe(DiffType.CREATED);
    expect(asResult(deepDiffMapper.map(2, undefined)).type).toBe(DiffType.DELETED);
  });

  it('applies string/number coercion', () => {
    expect(asResult(deepDiffMapper.map('42', 42)).type).toBe(DiffType.UNCHANGED);
    expect(asResult(deepDiffMapper.map('', 0)).type).toBe(DiffType.UNCHANGED);
    expect(asResult(deepDiffMapper.map(' ', 0)).type).toBe(DiffType.UPDATED);
  });

  it('applies string/boolean coercion', () => {
    expect(asResult(deepDiffMapper.map('true', true)).type).toBe(DiffType.UNCHANGED);
    expect(asResult(deepDiffMapper.map('false', false)).type).toBe(DiffType.UNCHANGED);
    expect(asResult(deepDiffMapper.map('', false)).type).toBe(DiffType.UNCHANGED);
  });

  it('trims whitespace when comparing strings', () => {
    expect(asResult(deepDiffMapper.map('John', '  John  ')).type).toBe(DiffType.UNCHANGED);
  });

  it('compares dates by timestamp', () => {
    const a = new Date(1000);
    const b = new Date(1000);
    expect(asResult(deepDiffMapper.map(a, b)).type).toBe(DiffType.UNCHANGED);
  });

  it('recursively diffs nested objects', () => {
    const diff = asMap(
      deepDiffMapper.map(
        { user: { name: 'John', age: 30 } },
        { user: { name: 'John', age: 31 } }
      )
    );
    const user = asMap(diff.user);
    expect(asResult(user.name).type).toBe(DiffType.UNCHANGED);
    expect(asResult(user.age).type).toBe(DiffType.UPDATED);
  });

  it('detects created keys in objects', () => {
    const diff = asMap(deepDiffMapper.map({ a: 1 }, { a: 1, b: 2 }));
    expect(asResult(diff.b).type).toBe(DiffType.CREATED);
    expect(asResult(diff.b).data).toBe(2);
  });

  it('throws for function arguments', () => {
    expect(() => deepDiffMapper.map(() => {}, {})).toThrow('Invalid argument. Function given, object expected.');
  });

  it('handles circular references without infinite recursion', () => {
    type Circular = { self?: Circular; value: number };
    const a: Circular = { value: 1 };
    a.self = a;
    const b: Circular = { value: 1 };
    b.self = b;
    expect(() => deepDiffMapper.map(a, b)).not.toThrow();
  });

  it('compareObjects convenience function delegates to the singleton', () => {
    const diff = asMap(compareObjects({ a: 1 }, { a: 2 }));
    expect(asResult(diff.a).type).toBe(DiffType.UPDATED);
  });
});
