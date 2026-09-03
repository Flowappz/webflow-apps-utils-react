import { objectsToModuleExports } from './objectsToModuleExports';

describe('objectsToModuleExports', () => {
  it('returns an empty string for an empty array', () => {
    expect(objectsToModuleExports([])).toBe('');
  });

  it('converts a single object to an export statement', () => {
    const result = objectsToModuleExports([{ moduleName: 'config', data: { a: 1 } }]);

    expect(result).toBe(`export const config = ${JSON.stringify({ a: 1 }, null, 2)};`);
  });

  it('joins multiple exports with blank lines', () => {
    const result = objectsToModuleExports([
      { moduleName: 'first', data: { a: 1 } },
      { moduleName: 'second', data: [1, 2] }
    ]);

    expect(result).toContain('export const first =');
    expect(result).toContain('export const second =');
    expect(result.split('\n\n')).toHaveLength(2);
  });
});
