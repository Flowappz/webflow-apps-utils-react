/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Converts an array of objects to module export statements.
 */
export const objectsToModuleExports = (exportsArray: Array<{ moduleName: string; data: any }>): string => {
  return exportsArray
    .map(({ moduleName, data }) => {
      const jsonString = JSON.stringify(data, null, 2);
      return `export const ${moduleName} = ${jsonString};`;
    })
    .join('\n\n');
};
