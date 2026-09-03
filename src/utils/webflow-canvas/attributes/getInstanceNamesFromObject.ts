/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Gets instance names from an object based on component configuration.
 */
export const getInstanceNamesFromObject = (
  obj: Record<string, any>,
  component: string,
  hasInstances?: boolean
): string[] => {
  if (!obj || typeof obj !== 'object') return [];

  let target = obj;

  if (hasInstances) {
    target = obj?.instances || obj;
  }

  return Object.keys(target)
    ?.map((key) => {
      return key;
    })
    ?.filter(Boolean);
};
