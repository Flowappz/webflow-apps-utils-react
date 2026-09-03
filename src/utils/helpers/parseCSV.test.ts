import { parseCSV } from './parseCSV';

describe('parseCSV', () => {
  it('parses CSV text into an array of records keyed by the header row', async () => {
    const csv = 'name,age\nAlice,30\nBob,25';

    const result = await parseCSV(csv);

    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' }
    ]);
  });

  it('skips empty lines and trims values', async () => {
    const csv = 'name,city\n\n Alice , Paris \n\nBob,Berlin\n';

    const result = await parseCSV(csv);

    expect(result).toEqual([
      { name: 'Alice', city: 'Paris' },
      { name: 'Bob', city: 'Berlin' }
    ]);
  });

  it('returns an empty array for a header-only CSV', async () => {
    await expect(parseCSV('name,age')).resolves.toEqual([]);
  });

  it('rejects for malformed CSV', async () => {
    // Unclosed quote
    await expect(parseCSV('name,age\n"Alice,30')).rejects.toThrow();
  });
});
