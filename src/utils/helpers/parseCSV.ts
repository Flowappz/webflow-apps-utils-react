import { parse } from 'csv-parse/browser/esm/sync';

/**
 * Parse CSV data
 * @param csvText CSV data as string
 * @returns Parsed CSV data as an array of objects
 */
export const parseCSV = async <Result extends Record<string, string>>(csvText: string): Promise<Result[]> => {
  return new Promise((resolve, reject) => {
    try {
      const results = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }) as Result[];

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};
