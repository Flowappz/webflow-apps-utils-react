import type { CustomCodeBlock } from '../../types';

/**
 * Gets stored Custom Code blocks by ID or returns all if no ID provided.
 */
export const getCustomCode = async (displayName?: string): Promise<Array<CustomCodeBlock>> => {
  //TODO: update this when typings are available plus any other place we have disabled this warning.
  //@ts-expect-error - not available in typings for now
  const customCodeBlock = (await webflow.getSiteCustomCode()) as Array<CustomCodeBlock>;

  if (!customCodeBlock || customCodeBlock.length === 0) return [];

  if (!displayName) return customCodeBlock;

  const storedConfigs = customCodeBlock.filter((block) => block.id === displayName);
  if (storedConfigs) return storedConfigs;

  return [];
};

/**
 * Sets custom code blocks in the site.
 */
export const setCustomCode = async (customCodeBlock: Array<CustomCodeBlock>): Promise<void> => {
  try {
    //@ts-expect-error - not available in typings for now
    await webflow.setSiteCustomCode(customCodeBlock);
  } catch (error) {
    console.error('Failed to save custom code block', error, customCodeBlock);
  }
};

/**
 * Removes a custom code block.
 */
export const removeCustomCode = (): boolean => {
  //TODO: implement when available
  return true;
};
