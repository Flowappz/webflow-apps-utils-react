/**
 * Gets the value of a custom attribute from a Webflow element.
 */
export const getWebflowElementAttribute = async (
  element: AnyElement,
  attributeName: string
): Promise<string | null> => {
  try {
    if (element?.customAttributes) {
      return await element?.getCustomAttribute(attributeName);
    }

    // @ts-expect-error - getAttribute is not typed
    if (element?.getAttribute) {
      // @ts-expect-error - getAttribute is not typed
      return await element?.getAttribute(attributeName);
    }

    return null;
  } catch (error) {
    console.error({}, 'Error in getWebflowElementAttribute:', error);
    return null;
  }
};
